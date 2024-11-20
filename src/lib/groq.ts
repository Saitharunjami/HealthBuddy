import { Groq } from "@groq/groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
});

export const generateMedicalResponse = async (message: string): Promise<string> => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are MED AI, a knowledgeable medical assistant. Provide helpful, accurate medical information while always emphasizing that users should consult healthcare professionals for personalized medical advice. Keep responses concise and easy to understand."
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error('Error generating response:', error);
    return "I apologize, but I'm having trouble connecting to the AI service. Please try again later.";
  }
};