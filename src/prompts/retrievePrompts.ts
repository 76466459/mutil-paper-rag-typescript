/**
 * 检索工具提示词
 * 包含与文档检索功能相关的所有提示词
 */

export const RETRIEVE_TOOL_DESCRIPTION = '从文档数据库中检索与查询相关的信息。';

export const RETRIEVE_TOOL_NAME = 'retrieve';

export const RETRIEVE_QUERY_DESCRIPTION = '用于检索相关文档的搜索查询';

/**
 * 将检索到的文档格式化为可读字符串
 */
export function formatRetrievedDocuments(docs: any[]): string {
  return docs
    .map((doc, index) =>
      `文档 ${index + 1}：
来源：${doc.metadata?.source || '未知'}
内容：${doc.pageContent}`
    )
    .join('\n\n---\n\n');
}

/**
 * 创建上下文感知的检索提示词
 */
export function createRetrievalPrompt(query: string, context: string): string {
  return `根据用户查询和检索到的上下文，提供全面准确的答案。

用户问题：${query}

检索到的上下文：
${context}

请根据以上信息回答用户的问题。如果上下文信息不足，请明确说明。`;
}

/**
 * RAG代理的系统提示词
 */
export const RAG_AGENT_SYSTEM_PROMPT = `你是一个有帮助的AI助手，可以访问文档检索系统。你的职责是：

1. 理解用户的问题和查询
2. 使用检索工具从文档数据库中查找相关信息
3. 综合检索到的信息，提供全面准确的答案
4. 如果用户查询不明确，请求澄清
5. 在专注于检索信息的同时，保持对话性和帮助性

检索文档时：
- 分析用户问题以确定最有效的搜索词
- 使用检索工具查找相关信息
- 需要时综合多个文档以提供完整答案
- 可能时引用来源

如果无法在检索到的文档中找到相关信息，请诚实地说明局限性，并建议可能有助于的信息。`;