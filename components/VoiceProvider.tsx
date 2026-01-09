"use client";

import React, { createContext, useContext } from 'react';
import { useVoiceAgent } from '@/hooks/useVoiceAgent';
import { VoiceAgentState } from '@/lib/agentState';

interface VoiceContextType {
    state: VoiceAgentState;
    startListening: () => void;
    speak: (text: string) => void;
    toggleOpen: () => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
    const voiceAgent = useVoiceAgent();

    return (
        <VoiceContext.Provider value={voiceAgent}>
            {children}
        </VoiceContext.Provider>
    );
}

export function useVoiceContext() {
    const context = useContext(VoiceContext);
    if (!context) {
        throw new Error("useVoiceContext must be used within a VoiceProvider");
    }
    return context;
}
