// New Types for Form Filling
export interface ContactFormState {
  name: string;
  email: string;
  message: string;
  isConfirmed: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export type AgentIntent =
  | "NAVIGATE"
  | "SCROLL"
  | "INFO"
  | "CLARIFY"
  | "UPDATE_FORM"
  | "SUBMIT_FORM";

export interface AgentResponse {
  agent_says: string;
  intent: AgentIntent;
  target?: string;
  direction?: string;
  // For Form Filling
  formData?: Partial<ContactFormState>;
}

export interface TextMessage {
  role: "user" | "agent";
  content: string;
}

export interface VoiceAgentState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  lastUserTranscript: string | null;
  lastAgentResponse: AgentResponse | null;
  error: string | null;
  history: TextMessage[];
  isOpen: boolean; // For the chat widget UI state
  contactForm: ContactFormState; // Shared form state
}
