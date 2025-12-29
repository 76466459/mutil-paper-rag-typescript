import mammoth from 'mammoth';
import { Document } from '@langchain/core/documents';
import { readFile } from 'fs/promises';
import { join } from 'path';

/**
 * 加载单个 Word 文档
 */
export async function loadWordDocument(filePath: string): Promise<Document> {
  try {
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    const text = result.value;

    return new Document({
      pageContent: text,
      metadata: {
        source: filePath,
        type: 'docx'
      }
    });
  } catch (error) {
    console.error(`Error loading Word document ${filePath}:`, error);
    throw error;
  }
}

/**
 * 读取 Word 文档内容（纯文本）
 */
export async function readWordContent(filePath: string): Promise<string> {
  try {
    const buffer = await readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error(`Error reading Word document ${filePath}:`, error);
    throw error;
  }
}

/**
 * 读取 Word 文档内容（HTML格式，保留格式）
 */
export async function readWordContentAsHTML(filePath: string): Promise<string> {
  try {
    const buffer = await readFile(filePath);
    const result = await mammoth.convertToHtml({ buffer });
    return result.value;
  } catch (error) {
    console.error(`Error reading Word document as HTML ${filePath}:`, error);
    throw error;
  }
}
