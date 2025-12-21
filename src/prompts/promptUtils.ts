/**
 * 提示词工具函数
 * 用于处理提示词和格式化响应的辅助函数
 */

import { Document } from '@langchain/core/documents';

/**
 * 模板变量接口
 */
export interface PromptVariables {
  [key: string]: string | number;
}

/**
 * 文档格式化选项
 */
export interface DocumentFormattingOptions {
  includeMetadata?: boolean;
  includeSource?: boolean;
  separator?: string;
  maxContentLength?: number;
}

/**
 * 简单的模板字符串插值
 */
export function interpolateTemplate(template: string, variables: PromptVariables): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = variables[key];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * 格式化文档用于提示词包含
 */
export function formatDocumentsForPrompt(
  documents: Document[],
  options: DocumentFormattingOptions = {}
): string {
  const {
    includeMetadata = true,
    includeSource = true,
    separator = '\n\n---\n\n',
    maxContentLength
  } = options;

  return documents
    .map((doc, index) => {
      let formattedDoc = '';

      if (includeMetadata) {
        formattedDoc += `文档 ${index + 1}：\n`;
      }

      if (includeSource && doc.metadata?.source) {
        formattedDoc += `来源：${doc.metadata.source}\n`;
      }

      let content = doc.pageContent;
      if (maxContentLength && content.length > maxContentLength) {
        content = content.substring(0, maxContentLength) + '...';
      }

      formattedDoc += `内容：${content}`;

      return formattedDoc;
    })
    .join(separator);
}

/**
 * 创建带文档的问答提示词
 */
export function createQAPrompt(
  question: string,
  documents: Document[],
  template: string = "根据以下上下文回答问题：\"{question}\"\n\n上下文：\n{context}",
  options?: DocumentFormattingOptions
): string {
  const context = formatDocumentsForPrompt(documents, options);
  return interpolateTemplate(template, {
    question,
    context,
    documentCount: documents.length
  });
}