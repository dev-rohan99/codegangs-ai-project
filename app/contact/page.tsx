"use client";

import { useVoiceContext } from "@/components/VoiceProvider";
import { Mail, MessageSquare, MessageSquareReply, Send, User } from "lucide-react";

export default function Contact() {
    const { state } = useVoiceContext();
    const { name, email, message, isConfirmed, isSubmitting, isSubmitted } = state.contactForm;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form submitted:", { name, email, message });
        // Add your form submission logic here
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-4">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Get In Touch
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    <div>
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-10 text-white h-full">
                            <h2 className="text-3xl font-bold mb-6">Let's Build Something Great</h2>
                            <p className="text-blue-100 text-lg mb-10">
                                Whether you need a web application, mobile app, or custom software solution, our team is ready to help turn your ideas into reality.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-blue-100">contact@codegangs.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MessageSquareReply className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Response Time</h3>
                                        <p className="text-blue-100">We typically respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Expert Team</h3>
                                        <p className="text-blue-100">Direct access to our development team</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-gray-200 p-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors text-black"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors text-black"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={message}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-600 focus:outline-none transition-colors resize-none text-black"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitted}
                                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-lg hover:bg-blue-700 transition-all hover:scale-105 disabled:bg-green-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
                            >
                                {isSubmitted ? (
                                    <>
                                        <span>Message Sent!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}