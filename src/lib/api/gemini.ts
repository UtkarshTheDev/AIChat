import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// Types
export interface ChatMessage {
  role: "user" | "model";
  content: string;
  timestamp?: Date;
  id?: string;
}

export interface ChatOptions {
  apiKey: string;
  modelName?: string;
  history?: ChatMessage[];
}

// Initialize the API
const initializeGeminiAPI = (apiKey: string) => {
  return new GoogleGenerativeAI(apiKey);
};

// Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Generate a chat response
export async function generateChatResponse(
  options: ChatOptions,
  prompt: string
): Promise<string> {
  try {
    const genAI = initializeGeminiAPI(options.apiKey);
    const model = genAI.getGenerativeModel({
      model: options.modelName || "gemini-2.0-flash-lite",
    });

    // Create a chat instance
    const chat = model.startChat({
      history: convertToGeminiHistory(options.history || []),
      safetySettings,
    });

    // Generate content
    const result = await chat.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Sorry, I'm having trouble connecting to my AI brain right now. Please try again later.";
  }
}

export async function generateImageResponse(
  options: ChatOptions,
  prompt: string,
  imageUrl: string
): Promise<string> {
  try {
    const genAI = initializeGeminiAPI(options.apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    // Get the base64 string from the data URL
    const base64String = imageUrl.split(",")[1];

    if (!base64String) {
      return "Error: Invalid image URL format.";
    }

    const imageParts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg", // Adjust if you know the actual type
          data: base64String, // Use the base64 string directly, not a Buffer
        },
      },
    ];

    const result = await model.generateContent(imageParts);
    const response = result.response;

    // Gemini can return null responses
    if (
      response &&
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts &&
      response.candidates[0].content.parts[0]
    ) {
      return response.candidates[0].content.parts[0].text || "";
    } else {
      return "Sorry, the image analysis didn't yield a response.";
    }
  } catch (error) {
    console.error("Error generating image response:", error);
    return "Sorry, I'm having trouble processing the image. Please try again with a different image or question.";
  }
}

// Helper function to convert our message format to Gemini's format
function convertToGeminiHistory(
  messages: ChatMessage[]
): { role: string; parts: { text: string }[] }[] {
  return messages.map((message) => ({
    role: message.role === "user" ? "user" : "model",
    parts: [{ text: message.content }],
  }));
}
