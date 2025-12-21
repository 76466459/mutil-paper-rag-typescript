import { initChatModel } from 'langchain';

process.env.GOOGLE_API_KEY = 'your-api-key';

export const model = await initChatModel(
  'google-genai:gemini-2.5-flash-lite'
);
