import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { embedding_3, model } from '../utils/llm-client/glmClient';
import { loadPDFs, splitDocuments } from '../utils/document-loader/PDFLoader';
import { createAgent } from 'langchain';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  RETRIEVE_TOOL_DESCRIPTION,
  RETRIEVE_TOOL_NAME,
  RETRIEVE_QUERY_DESCRIPTION,
  formatRetrievedDocuments,
  createQAPrompt,
  ENHANCED_QA_TEMPLATE,
  NO_RELEVANT_DOCS_RESPONSE,
  RAG_AGENT_SYSTEM_PROMPT
} from '../prompts';

// Initialize vector store
const vectorStore = new MemoryVectorStore(embedding_3);

/**
 * Initialize the RAG system by loading and indexing documents
 */
export async function initializeRagSystem(dataPath: string = '../../tests/'): Promise<void> {
  try {
    console.log('Initializing RAG system...');

    // Load PDF documents
    const documents = await loadPDFs(dataPath);

    // Split documents into chunks
    const allSplits = await splitDocuments(documents, 1000, 200);

    // Add documents to vector store
    await vectorStore.addDocuments(allSplits);

    console.log(`RAG system initialized with ${allSplits.length} document chunks.`);
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    throw error;
  }
}

/**
 * Create a retrieval tool for the RAG agent
 */
const retrieveSchema = z.object({
  query: z.string().describe(RETRIEVE_QUERY_DESCRIPTION),
});

const retrieveTool = tool(
  async ({ query }) => {
    try {
      console.log(`Retrieving documents for query: ${query}`);

      // Perform similarity search
      const retrievedDocs = await vectorStore.similaritySearch(query, 3);

      // Format the documents using the utility function
      const serialized = formatRetrievedDocuments(retrievedDocs);

      console.log(`Retrieved ${retrievedDocs.length} relevant documents`);

      return [serialized, retrievedDocs];
    } catch (error) {
      console.error('Error retrieving documents:', error);
      return ['Error retrieving documents. Please try again.', []];
    }
  },
  {
    name: RETRIEVE_TOOL_NAME,
    description: RETRIEVE_TOOL_DESCRIPTION,
    schema: retrieveSchema,
    responseFormat: 'content_and_artifact',
  }
);

/**
 * Create a RAG agent with document retrieval capabilities
 */
export function createRagAgent() {
  try {
    console.log('Creating RAG agent...');

    return createAgent({
      model: model,
      tools: [retrieveTool],
      systemPrompt: RAG_AGENT_SYSTEM_PROMPT,
    });

  } catch (error) {
    console.error('Error creating RAG agent:', error);
    throw error;
  }
}

/**
 * Process a user query using the RAG agent
 */
export async function processQuery(query: string) {
  try {
    console.log(`Processing query: ${query}`);

    const agent = createRagAgent();

    const agentInputs = {
      messages: [{
        role: 'user',
        content: query
      }]
    };

    const response = [];

    for await (const step of await agent.stream(agentInputs, {
      streamMode: 'values',
    })) {
      const lastMessage = step.messages[step.messages.length - 1];
      response.push(lastMessage);
    }

    return response;
  } catch (error) {
    console.error('Error processing query:', error);
    throw error;
  }
}

/**
 * 简单的问答函数，使用直接相似性搜索
 * 这是简单查询的快速替代方案
 */
export async function answerQuestion(query: string): Promise<string> {
  try {
    console.log(`回答问题: ${query}`);

    // 检索相关文档
    const retrievedDocs = await vectorStore.similaritySearch(query, 3);

    if (retrievedDocs.length === 0) {
      return NO_RELEVANT_DOCS_RESPONSE.replace('{query}', query);
    }

    // 使用增强模板创建提示词
    const prompt = createQAPrompt(query, retrievedDocs, ENHANCED_QA_TEMPLATE);

    // 获取模型响应
    const response = await model.invoke(prompt);

    return response.content as string;
  } catch (error) {
    console.error('回答问题时出错:', error);
    return '抱歉，在尝试回答您的问题时遇到了错误。';
  }
}
