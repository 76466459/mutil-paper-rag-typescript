/**
 * 提示词模块索引
 * 所有提示词相关功能的中央导出
 */

// 导出所有提示词模板和常量
export * from './retrievePrompts';
export * from './qaPrompts';
export * from './promptUtils';

// 重新导出常用项目以便使用
export {
  formatRetrievedDocuments,
  createRetrievalPrompt,
  RAG_AGENT_SYSTEM_PROMPT,
  RETRIEVE_TOOL_NAME,
  RETRIEVE_TOOL_DESCRIPTION
} from './retrievePrompts';

export {
  SIMPLE_QA_TEMPLATE,
  ENHANCED_QA_TEMPLATE,
  NO_RELEVANT_DOCS_RESPONSE
} from './qaPrompts';

export {
  interpolateTemplate,
  formatDocumentsForPrompt,
  createQAPrompt,
  type PromptVariables,
  type DocumentFormattingOptions
} from './promptUtils';