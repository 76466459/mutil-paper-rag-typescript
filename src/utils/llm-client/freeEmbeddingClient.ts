import { OpenAIEmbeddings } from '@langchain/openai';

/**
 * 免费 Embedding 方案
 * 
 * 方案 1: OpenAI 新用户有 $5 免费额度
 * 访问 https://platform.openai.com/api-keys 获取 API Key
 * 
 * 方案 2: 使用国内免费的 OpenAI 兼容服务
 * - 硅基流动 (https://siliconflow.cn/) - 免费额度
 * - 阿里云百炼 (https://bailian.console.aliyun.com/) - 免费额度
 */

// OpenAI Embedding (新用户有 $5 免费额度)
export const openaiEmbedding = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY || 'sk-your-key-here',
  modelName: 'text-embedding-3-small', // 最便宜的模型
});

// 硅基流动 - 免费 Embedding (OpenAI 兼容)
export const siliconflowEmbedding = new OpenAIEmbeddings({
  openAIApiKey: process.env.SILICONFLOW_API_KEY || 'sk-your-key-here',
  modelName: 'BAAI/bge-large-zh-v1.5', // 中文优化
  configuration: {
    baseURL: 'https://api.siliconflow.cn/v1',
  },
});

/**
 * 推荐使用硅基流动，原因：
 * 1. 完全免费（有免费额度）
 * 2. 支持中文
 * 3. 国内访问快
 * 4. OpenAI 兼容接口
 * 
 * 注册地址：https://siliconflow.cn/
 */
