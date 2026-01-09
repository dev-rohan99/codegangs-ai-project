"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { chatWithGemini } from '@/lib/gemini';
import { VoiceAgentState, AgentResponse } from '@/lib/agentState';

// Web Speech API Types (Augment window for TS)
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function useVoiceAgent() {
  const router = useRouter();
  
  const [state, setState] = useState<VoiceAgentState>({
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    lastUserTranscript: null,
    lastAgentResponse: null,
    error: null,
    history: [{ role: 'agent', content: "Hi! I'm your AI assistant. How can I help you navigate this portfolio?" }],
    isOpen: false,
    contactForm: {
      name: '',
      email: '',
      message: '',
      isConfirmed: false,
      isSubmitting: false,
      isSubmitted: false
    }
  });

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one command
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setState(prev => ({ ...prev, isListening: true, error: null }));
        };

        recognition.onend = () => {
          setState(prev => ({ ...prev, isListening: false }));
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setState(prev => ({ ...prev, isListening: false, error: "Listening failed: " + event.error }));
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log("User said:", transcript);
          setState(prev => ({ 
            ...prev, 
            lastUserTranscript: transcript,
            history: [...prev.history, { role: 'user', content: transcript }],
            isOpen: true // Auto-open chat on voice input
          }));
          handleAgentLogic(transcript);
        };

        recognitionRef.current = recognition;
      } else {
        setState(prev => ({ ...prev, error: "Browser does not support Speech Recognition." }));
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setState(prev => ({ ...prev, isSpeaking: true }));
      utterance.onend = () => setState(prev => ({ ...prev, isSpeaking: false }));
      
      // Optional: Select a specific voice if desired, or leave default
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAgentLogic = async (text: string) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    // Capture context if clarification was the intent of previous turn
    const lastQuestion = state.lastAgentResponse?.intent === 'CLARIFY' ? state.lastAgentResponse.agent_says : undefined;

    const response = await chatWithGemini(text, lastQuestion, state.contactForm);

    setState(prev => ({ 
      ...prev, 
      isProcessing: false,
      lastAgentResponse: response,
      history: [...prev.history, { role: 'agent', content: response.agent_says }]
    }));

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
      case 'NAVIGATE':
        if (response.target) {
            const target = response.target.toLowerCase();
            if (target.includes('home')) router.push('/');
            else if (target.includes('project')) router.push('/projects');
            else if (target.includes('contact')) router.push('/contact');
        }
        break;
      case 'SCROLL':
        if (typeof window !== 'undefined') {
            const amount = 500;
            const direction = response.direction === 'up' ? -amount : amount;
            window.scrollBy({ top: direction, behavior: 'smooth' });
        }
        break;
      case 'CLARIFY':
        // No action, just waiting for next input (handled by state and speaking)
        break;
      case 'INFO':
        // No action, handled by speaking
        break;
      case 'UPDATE_FORM':
        if (response.formData) {
            setState(prev => ({
                ...prev,
                contactForm: { ...prev.contactForm, ...response.formData },
                isOpen: true
            }));
            router.push('/contact'); // Ensure user sees the form
        }
        break;
      case 'SUBMIT_FORM':
        setState(prev => ({
            ...prev,
            contactForm: { ...prev.contactForm, isSubmitting: true }
        }));
        
        // Simulate API call
        setTimeout(() => {
            setState(prev => ({
                ...prev,
                contactForm: { ...prev.contactForm, isSubmitting: false, isSubmitted: true },
                history: [...prev.history, { role: 'agent', content: "Message sent successfully!" }]
            }));
            speak("Your message has been sent successfully.");
        }, 2000);
        break;
    }
  };

  const toggleOpen = () => setState(prev => ({ ...prev, isOpen: !prev.isOpen }));

  return {
    state,
    startListening,
    speak, // Exposed for debugging or intro
    toggleOpen
  };
}
