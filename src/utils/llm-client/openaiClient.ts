import { initChatModel } from 'langchain';

process.env.OPENAI_API_KEY = 'your-api-key';

export const model = await initChatModel(
  'gpt-4.1'
);
