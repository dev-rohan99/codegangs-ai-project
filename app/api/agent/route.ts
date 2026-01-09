import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a website assistant agent for Rohan Portfolio.
Your job is to understand the user command and decide the next step.

MODES:
1. Navigation/Control: user wants to go somewhere or scroll.
2. Information: user asks general questions about the portfolio owner.
3. Form Filling: User wants to "contact", "hire", or "send a message".

FORM FILLING RULES:
- If user intent is to contact, check if required fields (name, email, message) are missing.
- Ask ONE question at a time to fill missing fields.
- If all fields are present, ask for confirmation to send.
- If user confirms, return intent SUBMIT_FORM.
- If user provides data, return intent UPDATE_FORM with the extracted data in "formData".

Allowed intents:
NAVIGATE (home, projects, contact)
SCROLL (up, down)
INFO
CLARIFY
UPDATE_FORM (extraction of name/email/message)
SUBMIT_FORM (only after explicit confirmation)

Return ONLY valid JSON in this format:
{
  "agent_says": string,
  "intent": "NAVIGATE | SCROLL | INFO | CLARIFY | UPDATE_FORM | SUBMIT_FORM",
  "target"?: string,
  "direction"?: string,
  "formData"?: {
      "name"?: string,
      "email"?: string,
      "message"?: string
  }
}

Do not explain anything.`;

export async function POST(request: Request) {
  try {
    const { message, lastQuestion, currentFormState } = await request.json(); // Accept current form state
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    if (!apiKey) {
      console.error("Missing GEMINI_API_KEY");
      return NextResponse.json(
        {
          agent_says:
            "I am missing my brain (API Key). Please check server configuration.",
          intent: "INFO",
        },
        { status: 500 }
      );
    }

    // Construct context aware prompt
    let prompt = SYSTEM_PROMPT + '\n\nUser says: "' + message + '"';
    if (lastQuestion) {
      prompt += '\n(Context: Agent previously asked: "' + lastQuestion + '")';
    }
    if (currentFormState) {
      prompt +=
        "\n(Current Form State: " + JSON.stringify(currentFormState) + ")";
    }

    // Expanded model list to handle rate limits and availability
    // Trying experimental and latest aliases which might have separate quotas or be available
    const models = [
      "gemini-2.0-flash-exp",
      "gemini-2.0-flash",
      "gemini-2.0-flash-lite",
      "gemini-flash-latest",
      "gemini-pro-latest",
    ];
    let lastError = null;

    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error(`Gemini API Error (${model}):`, errorBody);
          lastError = new Error(
            `Gemini API Error (${model}): ${response.statusText} ${errorBody}`
          );
          continue; // Try next model
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
          throw new Error("No response from Gemini");
        }

        // Clean markdown code blocks if any (Gemini sometimes adds ```json ... ```)
        const cleanedText = generatedText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        try {
          const parsed = JSON.parse(cleanedText);
          return NextResponse.json(parsed);
        } catch (e) {
          console.error("Failed to parse JSON from Gemini:", cleanedText);
          return NextResponse.json({
            agent_says:
              "I understood, but I got confused executing the command.",
            intent: "INFO",
          });
        }
      } catch (e) {
        console.error(`Attempt failed for ${model}:`, e);
        lastError = e as Error;
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("All models failed");
  } catch (error) {
    console.error("Server Error in /api/agent:", error);
    return NextResponse.json(
      {
        agent_says: "I am having trouble connecting to the server.",
        intent: "INFO",
      },
      { status: 500 }
    );
  }
}
