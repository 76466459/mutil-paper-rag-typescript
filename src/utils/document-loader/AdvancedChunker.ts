import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

/**
 * 高级分块策略接口
 */
export interface ChunkingStrategy {
  name: string;
  description: string;
  chunk(documents: Document[]): Promise<Document[]>;
}

/**
 * 1. 语义分块策略
 * 基于段落和句子边界进行智能分块，保持语义完整性
 */
export class SemanticChunker implements ChunkingStrategy {
  name = 'Semantic Chunking';
  description = '基于段落和句子边界的语义分块，保持内容完整性';

  constructor(
    private maxChunkSize: number = 1000,
    private minChunkSize: number = 200
  ) {}

  async chunk(documents: Document[]): Promise<Document[]> {
    const chunks: Document[] = [];

    for (const doc of documents) {
      const text = doc.pageContent;
      
      // 按段落分割（双换行符）
      const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
      
      let currentChunk = '';
      let chunkMetadata = { ...doc.metadata };

      for (let i = 0; i < paragraphs.length; i++) {
        const paragraph = paragraphs[i].trim();
        
        // 如果当前段落加上现有内容超过最大长度
        if (currentChunk.length + paragraph.length > this.maxChunkSize) {
          // 保存当前块（如果不为空）
          if (currentChunk.length >= this.minChunkSize) {
            chunks.push(new Document({
              pageContent: currentChunk.trim(),
              metadata: {
                ...chunkMetadata,
                chunkIndex: chunks.length,
                chunkingStrategy: this.name
              }
            }));
            currentChunk = '';
          }
          
          // 如果单个段落太长，需要进一步分割
          if (paragraph.length > this.maxChunkSize) {
            const sentences = this.splitIntoSentences(paragraph);
            let sentenceChunk = '';
            
            for (const sentence of sentences) {
              if (sentenceChunk.length + sentence.length > this.maxChunkSize) {
                if (sentenceChunk.length > 0) {
                  chunks.push(new Document({
                    pageContent: sentenceChunk.trim(),
                    metadata: {
                      ...chunkMetadata,
                      chunkIndex: chunks.length,
                      chunkingStrategy: this.name
                    }
                  }));
                }
                sentenceChunk = sentence;
              } else {
                sentenceChunk += (sentenceChunk ? ' ' : '') + sentence;
              }
            }
            
            if (sentenceChunk.length > 0) {
              currentChunk = sentenceChunk;
            }
          } else {
            currentChunk = paragraph;
          }
        } else {
          currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        }
      }

      // 保存最后一个块
      if (currentChunk.length >= this.minChunkSize) {
        chunks.push(new Document({
          pageContent: currentChunk.trim(),
          metadata: {
            ...chunkMetadata,
            chunkIndex: chunks.length,
            chunkingStrategy: this.name
          }
        }));
      }
    }

    console.log(`${this.name}: Created ${chunks.length} semantic chunks`);
    return chunks;
  }

  private splitIntoSentences(text: string): string[] {
    // 中英文句子分割
    return text
      .split(/([。！？\.!?]+["']?\s*)/)
      .filter(s => s.trim().length > 0)
      .reduce((acc, curr, idx, arr) => {
        if (idx % 2 === 0 && arr[idx + 1]) {
          acc.push(curr + arr[idx + 1]);
        } else if (idx % 2 === 0) {
          acc.push(curr);
        }
        return acc;
      }, [] as string[]);
  }
}

/**
 * 2. 滑动窗口分块策略
 * 使用重叠窗口确保上下文连续性
 */
export class SlidingWindowChunker implements ChunkingStrategy {
  name = 'Sliding Window Chunking';
  description = '滑动窗口分块，确保上下文连续性';

  constructor(
    private windowSize: number = 1000,
    private stepSize: number = 800 // 重叠 200 字符
  ) {}

  async chunk(documents: Document[]): Promise<Document[]> {
    const chunks: Document[] = [];

    for (const doc of documents) {
      const text = doc.pageContent;
      let start = 0;

      while (start < text.length) {
        const end = Math.min(start + this.windowSize, text.length);
        const chunkText = text.slice(start, end);

        // 尝试在句子边界结束
        let adjustedEnd = end;
        if (end < text.length) {
          const lastPeriod = chunkText.lastIndexOf('。');
          const lastQuestion = chunkText.lastIndexOf('？');
          const lastExclamation = chunkText.lastIndexOf('！');
          const lastDot = chunkText.lastIndexOf('.');
          
          const boundary = Math.max(lastPeriod, lastQuestion, lastExclamation, lastDot);
          if (boundary > this.windowSize * 0.7) {
            adjustedEnd = start + boundary + 1;
          }
        }

        chunks.push(new Document({
          pageContent: text.slice(start, adjustedEnd).trim(),
          metadata: {
            ...doc.metadata,
            chunkIndex: chunks.length,
            chunkingStrategy: this.name,
            windowStart: start,
            windowEnd: adjustedEnd
          }
        }));

        start += this.stepSize;
      }
    }

    console.log(`${this.name}: Created ${chunks.length} sliding window chunks`);
    return chunks;
  }
}

/**
 * 3. 层次化分块策略
 * 创建多层次的文档块，包含父子关系
 */
export class HierarchicalChunker implements ChunkingStrategy {
  name = 'Hierarchical Chunking';
  description = '层次化分块，保留文档结构和上下文';

  constructor(
    private parentSize: number = 2000,
    private childSize: number = 500,
    private overlap: number = 100
  ) {}

  async chunk(documents: Document[]): Promise<Document[]> {
    const chunks: Document[] = [];

    for (const doc of documents) {
      const text = doc.pageContent;
      
      // 创建父块
      const parentSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: this.parentSize,
        chunkOverlap: this.overlap,
      });
      const parentChunks = await parentSplitter.splitText(text);

      // 为每个父块创建子块
      for (let i = 0; i < parentChunks.length; i++) {
        const parentText = parentChunks[i];
        const parentId = `parent_${i}`;

        // 创建子块
        const childSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: this.childSize,
          chunkOverlap: this.overlap,
        });
        const childChunks = await childSplitter.splitText(parentText);

        for (let j = 0; j < childChunks.length; j++) {
          chunks.push(new Document({
            pageContent: childChunks[j],
            metadata: {
              ...doc.metadata,
              chunkIndex: chunks.length,
              chunkingStrategy: this.name,
              parentId,
              parentText: parentText.slice(0, 200) + '...', // 保存父块摘要
              childIndex: j,
              totalChildren: childChunks.length
            }
          }));
        }
      }
    }

    console.log(`${this.name}: Created ${chunks.length} hierarchical chunks`);
    return chunks;
  }
}

/**
 * 4. 智能分块策略（推荐）
 * 结合多种策略的优点
 */
export class SmartChunker implements ChunkingStrategy {
  name = 'Smart Chunking';
  description = '智能分块，自动选择最佳策略';

  constructor(
    private targetSize: number = 800,
    private maxSize: number = 1200,
    private minSize: number = 300
  ) {}

  async chunk(documents: Document[]): Promise<Document[]> {
    const chunks: Document[] = [];

    for (const doc of documents) {
      const text = doc.pageContent;
      
      // 检测文档类型
      const hasStructure = this.detectStructure(text);
      
      if (hasStructure) {
        // 结构化文档：按标题和段落分块
        chunks.push(...await this.chunkStructuredText(text, doc.metadata));
      } else {
        // 非结构化文档：使用语义分块
        const semanticChunker = new SemanticChunker(this.maxSize, this.minSize);
        chunks.push(...await semanticChunker.chunk([doc]));
      }
    }

    console.log(`${this.name}: Created ${chunks.length} smart chunks`);
    return chunks;
  }

  private detectStructure(text: string): boolean {
    // 检测是否有标题结构（如 "一、" "1." "第一章" 等）
    const titlePatterns = [
      /^[一二三四五六七八九十]+[、．]/m,
      /^第[一二三四五六七八九十]+[章节条]/m,
      /^\d+[\.、]/m,
      /^[（(]\d+[)）]/m,
    ];
    
    return titlePatterns.some(pattern => pattern.test(text));
  }

  private async chunkStructuredText(text: string, metadata: any): Promise<Document[]> {
    const chunks: Document[] = [];
    
    // 按标题分割
    const sections = text.split(/(?=^[一二三四五六七八九十]+[、．]|^第[一二三四五六七八九十]+[章节条]|^\d+[\.、])/m);
    
    for (const section of sections) {
      if (section.trim().length === 0) continue;
      
      if (section.length <= this.maxSize) {
        // 小节直接作为一个块
        chunks.push(new Document({
          pageContent: section.trim(),
          metadata: {
            ...metadata,
            chunkIndex: chunks.length,
            chunkingStrategy: this.name,
            isStructured: true
          }
        }));
      } else {
        // 大节需要进一步分割
        const paragraphs = section.split(/\n\n+/);
        let currentChunk = '';
        
        for (const para of paragraphs) {
          if (currentChunk.length + para.length > this.maxSize) {
            if (currentChunk.length >= this.minSize) {
              chunks.push(new Document({
                pageContent: currentChunk.trim(),
                metadata: {
                  ...metadata,
                  chunkIndex: chunks.length,
                  chunkingStrategy: this.name,
                  isStructured: true
                }
              }));
            }
            currentChunk = para;
          } else {
            currentChunk += (currentChunk ? '\n\n' : '') + para;
          }
        }
        
        if (currentChunk.length >= this.minSize) {
          chunks.push(new Document({
            pageContent: currentChunk.trim(),
            metadata: {
              ...metadata,
              chunkIndex: chunks.length,
              chunkingStrategy: this.name,
              isStructured: true
            }
          }));
        }
      }
    }
    
    return chunks;
  }
}

/**
 * 分块策略工厂
 */
export class ChunkerFactory {
  static create(strategy: 'semantic' | 'sliding' | 'hierarchical' | 'smart' = 'smart'): ChunkingStrategy {
    switch (strategy) {
      case 'semantic':
        return new SemanticChunker();
      case 'sliding':
        return new SlidingWindowChunker();
      case 'hierarchical':
        return new HierarchicalChunker();
      case 'smart':
      default:
        return new SmartChunker();
    }
  }

  static listStrategies(): string[] {
    return ['semantic', 'sliding', 'hierarchical', 'smart'];
  }
}
