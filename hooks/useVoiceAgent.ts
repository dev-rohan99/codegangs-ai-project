"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { chatWithGemini } from "@/lib/gemini";
import {
  VoiceAgentState,
  AgentResponse,
  ContactFormState,
} from "@/lib/agentState";

// Web Speech API Types (Augment window for TS)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Memory Interface
interface AgentMemory {
  lastQuestion?: string;
  formState?: ContactFormState;
  history?: any[]; // Keep chat history too for better UX
}

const MEMORY_KEY = "agent_memory_v1";

export function useVoiceAgent() {
  const router = useRouter();

  // Initial State logic (lazy init not ideal for hydration, so start empty and load in useEffect)
  const [state, setState] = useState<VoiceAgentState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    lastUserTranscript: null,
    lastAgentResponse: null,
    error: null,
    history: [
      {
        role: "agent",
        content:
          "Hi! I'm your AI assistant. How can I help you navigate this portfolio?",
      },
    ],
    isOpen: false,
    contactForm: {
      name: "",
      email: "",
      message: "",
      isConfirmed: false,
      isSubmitting: false,
      isSubmitted: false,
    },
  });

  const recognitionRef = useRef<any>(null);

  // --- Memory Management ---
  const loadAgentMemory = (): AgentMemory | null => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(MEMORY_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("Failed to load memory", e);
      return null;
    }
  };

  const saveAgentMemory = (memory: AgentMemory) => {
    if (typeof window === "undefined") return;
    try {
      // Merge with existing to avoid dataloss if we only saving partials?
      // Actually simple overwrite is cleaner for this scale if we pass full object
      const current = loadAgentMemory() || {};
      const updated = { ...current, ...memory };
      localStorage.setItem(MEMORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save memory", e);
    }
  };

  const clearMemory = () => {
    if (typeof window !== "undefined") localStorage.removeItem(MEMORY_KEY);
  };

  // Load Memory on Mount
  useEffect(() => {
    const memory = loadAgentMemory();
    if (memory) {
      setState((prev) => ({
        ...prev,
        // Restore Form State
        contactForm: memory.formState || prev.contactForm,
        // Restore History if available
        history: memory.history || prev.history,
        // Restore last question context indirectly via a "silent" lastAgentResponse if needed?
        // Actually we just need to know it for the API call.
        // We can store it in a specialized field or just assume lastAgentResponse.agent_says is enough if we restored history?
        // Let's rely on the restored state for now.
        lastAgentResponse: memory.lastQuestion
          ? ({
              agent_says: memory.lastQuestion,
              intent: "CLARIFY", // Mock intent to ensure it's treated as context
            } as AgentResponse)
          : prev.lastAgentResponse,
      }));
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one command
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setState((prev: any) => ({
            ...prev,
            isListening: true,
            error: null,
          }));
        };

        recognition.onend = () => {
          setState((prev: any) => ({ ...prev, isListening: false }));
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setState((prev: any) => ({
            ...prev,
            isListening: false,
            error: "Listening failed: " + event.error,
          }));
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log("User said:", transcript);
          setState((prev: any) => {
            const newState = {
              ...prev,
              lastUserTranscript: transcript,
              history: [...prev.history, { role: "user", content: transcript }],
              isOpen: true,
            };
            // Save history incrementally
            saveAgentMemory({ history: newState.history });
            return newState;
          });
          handleAgentLogic(transcript);
        };

        recognitionRef.current = recognition;
      } else {
        setState((prev) => ({
          ...prev,
          error: "Browser does not support Speech Recognition.",
        }));
      }
    }
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening && !state.isProcessing) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Start error", e);
      }
    }
  }, [state.isListening, state.isProcessing]);

  const speak = useCallback((text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () =>
        setState((prev) => ({ ...prev, isSpeaking: true }));
      utterance.onend = () =>
        setState((prev) => ({ ...prev, isSpeaking: false }));
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAgentLogic = async (text: string) => {
    setState((prev) => ({ ...prev, isProcessing: true }));

    // Memory: Load context to send to API
    const memory = loadAgentMemory();
    // Context is either from current state (if in-memory) or persisted memory
    // Prefer state if available (most recent), fallback to memory
    const lastQuestion =
      (state.lastAgentResponse?.intent === "CLARIFY"
        ? state.lastAgentResponse.agent_says
        : undefined) || memory?.lastQuestion;

    // Use current form state (which might have been loaded from memory on mount)
    const response = await chatWithGemini(
      text,
      lastQuestion,
      state.contactForm
    );

    setState((prev) => {
      const newHistory = [
        ...prev.history,
        { role: "agent", content: response.agent_says },
      ];
      const newState = {
        ...prev,
        isProcessing: false,
        lastAgentResponse: response,
        history: newHistory,
      };
      // Save History
      saveAgentMemory({ history: newHistory });
      return newState as VoiceAgentState; // TS Help
    });

    // Handle "Last Question" persistence
    if (response.intent === "CLARIFY" || response.intent === "UPDATE_FORM") {
      saveAgentMemory({ lastQuestion: response.agent_says });
    } else {
      // Clear last question if intent changed (e.g. navigated)?
      // Or keep it? User said "If intent === CLARIFY -> save".
      // Implies we only overwrite if clarify.
      // But if I ask "Go home", the previous question is irrelevant.
      // However, "UPDATE_FORM" also asks questions.
    }

    // Execute Response
    if (response.agent_says) {
      speak(response.agent_says);
    }

    // Execute Action
    executeAction(response);
  };

  const executeAction = (response: AgentResponse) => {
    console.log("Executing Action:", response);
    switch (response.intent) {
      case "NAVIGATE":
        if (response.target) {
          const target = response.target.toLowerCase();
          if (target.includes("home")) router.push("/");
          else if (target.includes("project")) router.push("/projects");
          else if (target.includes("contact")) router.push("/contact");
        }
        break;
      case "SCROLL":
        if (typeof window !== "undefined") {
          const amount = 500;
          const direction = response.direction === "up" ? -amount : amount;
          window.scrollBy({ top: direction, behavior: "smooth" });
        }
        break;
      case "CLARIFY":
        // Persist question (handled above in handleAgentLogic common path)
        break;
      case "INFO":
        break;
      case "UPDATE_FORM":
        if (response.formData) {
          setState((prev) => {
            const updatedForm = { ...prev.contactForm, ...response.formData };
            const newState = {
              ...prev,
              contactForm: updatedForm,
              isOpen: true,
            };
            // Persist Form Update
            saveAgentMemory({ formState: updatedForm });
            return newState;
          });
          router.push("/contact");
        }
        break;
      case "SUBMIT_FORM":
        setState((prev) => ({
          ...prev,
          contactForm: { ...prev.contactForm, isSubmitting: true },
        }));

        // Simulate API call
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            contactForm: {
              ...prev.contactForm,
              isSubmitting: false,
              isSubmitted: true,
            },
            history: [
              ...prev.history,
              { role: "agent", content: "Message sent successfully!" },
            ],
          }));
          speak("Your message has been sent successfully.");

          // Clear Memory on Submit
          clearMemory();
          // Maybe keep history? User said "Clear memory".
          // Usually we want to clear the form but keep the chat?
          // "If intent === SUBMIT_FORM → clear memory"
          // I'll follow instructions strictly.
        }, 2000);
        break;
    }
  };

  const toggleOpen = () =>
    setState((prev) => ({ ...prev, isOpen: !prev.isOpen }));

  return {
    state,
    startListening,
    speak,
    toggleOpen,
  };
}
