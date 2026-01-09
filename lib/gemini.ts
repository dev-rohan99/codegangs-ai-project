import { AgentResponse, ContactFormState } from './agentState';

export async function chatWithGemini(userText: string, lastQuestion?: string, currentFormState?: ContactFormState): Promise<AgentResponse> {
  try {
    const response = await fetch('/api/agent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userText,
        lastQuestion,
        currentFormState,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data: AgentResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error communicating with Agent API:", error);
    return {
      agent_says: "I am having trouble connecting to the server.",
      intent: "INFO"
    };
  }
}
