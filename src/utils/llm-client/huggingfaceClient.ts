import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

/**
 * HuggingFace 免费 Embedding 客户端
 * 使用免费的 HuggingFace Inference API
 * 
 * 获取 API Key:
 * 1. 访问 https://huggingface.co/settings/tokens
 * 2. 创建一个新的 Access Token (免费)
 * 3. 将 Token 设置到环境变量 HUGGINGFACE_API_KEY
 */

// 使用中文优化的 Embedding 模型
export const hfEmbedding = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_your_api_key_here',
  model: 'sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2', // 支持中文
});

// 备选模型（更快但英文为主）
export const hfEmbeddingFast = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY || 'hf_your_api_key_here',
  model: 'sentence-transformers/all-MiniLM-L6-v2',
});
