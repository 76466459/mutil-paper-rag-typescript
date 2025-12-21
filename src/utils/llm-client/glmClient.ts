import { ChatZhipuAI } from '@langchain/community/chat_models/zhipuai';
import { ZhipuAIEmbeddings } from '@langchain/community/embeddings/zhipuai';

const zhipuAIApiKey = '8eec6e0f044a4047af52b5b1436e73f8.yGzz3lypRa0VIS5J';

// Use glm-4
export const model = new ChatZhipuAI({
  model: 'glm-4.6', // Available models:
  temperature: 0.9,
  zhipuAIApiKey: zhipuAIApiKey, // In Node.js defaults to process.env.ZHIPUAI_API_KEY
});

// Use embedding-3
export const embedding_3 = new ZhipuAIEmbeddings({
  modelName: 'embedding-3',
  apiKey: zhipuAIApiKey,
});

// const messages = [new HumanMessage('Hello')];
//
// const res = await glm3turbo.invoke(messages);
// /*
// AIMessage {
//   content: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
// }
// */
//
// const res2 = await glm4.invoke(messages);
// /*
// AIMessage {
//   text: "Hello! How can I help you today? Is there something you would like to talk about or ask about? I'm here to assist you with any questions you may have.",
// }
// */
