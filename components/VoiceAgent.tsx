"use client";

import { useVoiceContext } from "@/components/VoiceProvider";
import { HatGlasses } from "lucide-react";
import { useEffect, useRef } from "react";

export default function VoiceAgent() {
    const { state, startListening, toggleOpen } = useVoiceContext();
    const { isListening, isProcessing, history, isOpen, error } = state;
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history, isOpen, isProcessing]);

    return (
        <div className="chat-widget">
            {isOpen ? (
                <div className="chat-window">
                    {/* Header */}
                    <div className="chat-header">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✨</span>
                            <span className="font-bold">AI Assistant</span>
                        </div>
                        <button onClick={toggleOpen} className="text-gray-400 hover:text-white">
                            ✕
                        </button>
                    </div>

                    {/* Body (History) */}
                    <div className="chat-body">
                        {history.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}

                        {/* Thinking Indicator */}
                        {isProcessing && (
                            <div className="message agent flex items-center gap-2 text-gray-400">
                                <span className="animate-pulse">Thinking...</span>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="message agent text-red-400 border border-red-500/30">
                                ⚠️ {error}
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    {/* Footer (Controls) */}
                    <div className="chat-footer">
                        <button
                            onClick={startListening}
                            className={`mic-btn ${isListening ? 'listening' : ''}`}
                            disabled={isProcessing}
                            title="Push to Talk"
                        >
                            {isListening ? '👂' : isProcessing ? '⏳' : '🎙️'}
                        </button>
                    </div>
                </div>
            ) : (
                /* Floating Toggle Button */
                <button onClick={toggleOpen} className="toggle-btn" title="Open AI Assistant">
                    <HatGlasses />
                </button>
            )}
        </div>
    );
}
