import { MemoryVectorStore } from '@langchain/classic/vectorstores/memory';
import { embedding_3, model } from '../utils/llm-client/glmClient';
import { loadPDFs, splitDocuments } from '../utils/document-loader/PDFLoader';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const vectorStore = new MemoryVectorStore(embedding_3);

export async function initializeRagSystem(dataPath: string = '../tests/'): Promise<void> {
  try {
    console.log('Initializing RAG system...');
    const documents = await loadPDFs(dataPath);
    const allSplits = await splitDocuments(documents, 1000, 200);
    await vectorStore.addDocuments(allSplits);
    console.log(`RAG system initialized with ${allSplits.length} document chunks.`);
  } catch (error) {
    console.error('Error initializing RAG system:', error);
    throw error;
  }
}

export async function processQuery(query: string) {
  try {
    console.log(`🔍 Processing query: ${query}`);

    // 检索相关文档
    const retrievedDocs = await vectorStore.similaritySearch(query, 3);

    console.log(`📚 Retrieved ${retrievedDocs.length} documents:`);

    if (retrievedDocs.length === 0) {
      console.log('❌ No relevant documents found');
      return [{
        role: 'assistant',
        content: '抱歉，我没有找到相关的文档来回答您的问题。'
      }];
    }

    // 显示检索到的文档片段（用于验证）
    retrievedDocs.forEach((doc, index) => {
      console.log(`\n--- Document ${index + 1} ---`);
      console.log(`Source: ${doc.metadata?.source || 'Unknown'}`);
      // console.log(`Content preview: ${doc.pageContent.substring(0, 200)}...`);
      console.log(`Content preview: ${doc.pageContent.substring(0, 1000)}...`);
      console.log(`Full content length: ${doc.pageContent.length} chars`);
    });

    // 构建上下文
    const docsContent = retrievedDocs
      .map((doc) => doc.pageContent)
      .join('\n\n');

    console.log(`\n📝 Generated context length: ${docsContent.length} characters`);

    // 构建提示词
    const systemPrompt = `你是一个有用的助手。请基于以下上下文来回答用户的问题。如果上下文中没有相关信息，请说明无法回答。

上下文：
${docsContent}

请用中文回答用户的问题。`;

    console.log(`🤖 Generating response using LLM...`);

    // 创建消息
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(query)
    ];

    // 调用模型
    const response = await model.invoke(messages);

    const finalAnswer = response.content as string;
    console.log(`\n✅ Final answer length: ${finalAnswer.length} characters`);
    console.log(`🎯 Answer preview: ${finalAnswer.substring(0, 150)}...`);

    return [{
      role: 'assistant',
      content: finalAnswer
    }];

  } catch (error) {
    console.error('Error processing query:', error);
    return [{
      role: 'assistant',
      content: '抱歉，在处理您的问题时遇到了错误。'
    }];
  }
}

// 定义文档分析类型
interface DocumentAnalysis {
  index: number;
  source: string;
  contentLength: number;
  contentPreview: string;
  keywordMatches: number;
  keywordMatchRate: string;
  similarityScore: string;
  relevantKeywords: string[];
}

// 定义回答分析类型
interface AnswerAnalysis {
  answerLength: number;
  generationTime: string;
  containsDocReferences: boolean;
  answerQuality: number;
  documentWordOverlap: number;
  documentWordOverlapRate: string;
}

// 新增：分析特定查询的RAG效果
export async function analyzeRAGEffectiveness(query: string, debug: boolean = true) {
  console.log(`🔬 Analyzing RAG effectiveness for: "${query}"`);

  try {
    // 1. 检索阶段分析
    const retrievedDocs = await vectorStore.similaritySearch(query, 3);

    const retrievalAnalysis = {
      documentsFound: retrievedDocs.length,
      documents: [] as DocumentAnalysis[],
      totalContentLength: 0,
      averageContentLength: 0,
      relevanceScore: 0,
      maxPossibleScore: 0
    };

    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 1);

    if (retrievedDocs.length > 0) {
      retrievalAnalysis.totalContentLength = retrievedDocs.reduce((sum, doc) => sum + doc.pageContent.length, 0);
      retrievalAnalysis.averageContentLength = Math.round(retrievalAnalysis.totalContentLength / retrievedDocs.length);
      retrievalAnalysis.maxPossibleScore = keywords.length * retrievedDocs.length;

      retrievedDocs.forEach((doc, index) => {
        const content = doc.pageContent.toLowerCase();
        const keywordMatches = keywords.filter(keyword => content.includes(keyword)).length;
        const similarityScore = Math.random() * 0.3 + 0.7; // 模拟相似度分数

        retrievalAnalysis.relevanceScore += keywordMatches;

        const docInfo = {
          index: index + 1,
          source: doc.metadata?.source || 'Unknown',
          contentLength: doc.pageContent.length,
          contentPreview: doc.pageContent.substring(0, 150) + '...',
          keywordMatches,
          keywordMatchRate: (keywordMatches / keywords.length * 100).toFixed(1) + '%',
          similarityScore: similarityScore.toFixed(3),
          relevantKeywords: keywords.filter(keyword => content.includes(keyword))
        };

        retrievalAnalysis.documents.push(docInfo);

        if (debug) {
          console.log(`📄 Doc ${index + 1}: ${docInfo.keywordMatches}/${keywords.length} keywords match (${docInfo.keywordMatchRate})`);
        }
      });
    }

    // 2. 生成阶段分析
    const startTime = Date.now();
    const response = await processQuery(query);
    const generationTime = Date.now() - startTime;

    const answer = response[0]?.content || '';
    const answerAnalysis: AnswerAnalysis = {
      answerLength: answer.length,
      generationTime: `${generationTime}ms`,
      containsDocReferences: false,
      answerQuality: 0,
      documentWordOverlap: 0,
      documentWordOverlapRate: '0%'
    };

    // 检查回答是否包含文档中的特定词汇
    const docKeywords = new Set();
    retrievedDocs.forEach(doc => {
      doc.pageContent.toLowerCase().split(/\s+/).forEach(word => {
        if (word.length > 3) docKeywords.add(word);
      });
    });

    const answerWords = answer.toLowerCase().split(/\s+/);
    const sharedWords = answerWords.filter(word => docKeywords.has(word));

    answerAnalysis.containsDocReferences = sharedWords.length > 5;
    answerAnalysis.documentWordOverlap = sharedWords.length;
    answerAnalysis.documentWordOverlapRate = ((sharedWords.length / answerWords.length) * 100).toFixed(1) + '%';

    // 3. 综合评分
    const overallScore = calculateRAGScore(retrievalAnalysis, answerAnalysis);

    const analysis = {
      query,
      timestamp: new Date().toISOString(),
      overall: {
        score: overallScore.score,
        rating: overallScore.rating,
        summary: overallScore.summary
      },
      retrieval: retrievalAnalysis,
      generation: answerAnalysis,
      effectiveness: {
        workingWell: overallScore.score > 60,
        issues: overallScore.issues,
        recommendations: overallScore.recommendations
      }
    };

    if (debug) {
      console.log(`\n📊 RAG Analysis Results:`);
      console.log(`🎯 Overall Score: ${overallScore.score}/100 (${overallScore.rating})`);
      console.log(`📚 Retrieval: ${retrievalAnalysis.documentsFound} docs found, avg relevance: ${retrievalAnalysis.documents.length > 0 ? (retrievalAnalysis.relevanceScore / retrievalAnalysis.maxPossibleScore * 100).toFixed(1) : 0}%`);
      console.log(`💬 Generation: ${answerAnalysis.answerLength} chars, ${answerAnalysis.generationTime} generation time`);
      console.log(`🔗 Document overlap: ${answerAnalysis.documentWordOverlap} shared words (${answerAnalysis.documentWordOverlapRate})`);
    }

    return analysis;

  } catch (error) {
    console.error('❌ RAG analysis failed:', error);
    return {
      query,
      error: error instanceof Error ? error.message : String(error),
      workingWell: false
    };
  }
}

// 计算RAG综合评分
function calculateRAGScore(retrieval: any, generation: AnswerAnalysis) {
  let score = 0;
  const issues = [];
  const recommendations = [];

  // 检索评分 (40%)
  if (retrieval.documentsFound === 0) {
    issues.push('没有检索到任何文档');
    recommendations.push('检查文档是否正确加载，或调整检索参数');
  } else {
    score += 20;

    if (retrieval.relevanceScore > 0) {
      score += 20 * (retrieval.relevanceScore / retrieval.maxPossibleScore);
    }

    if (retrieval.averageContentLength < 50) {
      issues.push('检索到的文档内容过短');
      recommendations.push('调整文档分块参数');
    }
  }

  // 生成评分 (60%)
  if (generation.answerLength === 0) {
    issues.push('没有生成任何回答');
    recommendations.push('检查LLM配置和API密钥');
  } else {
    score += 30;

    if (generation.answerLength > 50 && generation.answerLength < 1000) {
      score += 15;
    }

    if (generation.containsDocReferences) {
      score += 15;
    }
  }

  // 确定评级
  let rating = 'Poor';
  let summary = '';

  if (score >= 80) {
    rating = 'Excellent';
    summary = 'RAG系统运行良好，检索和生成都很有效';
  } else if (score >= 60) {
    rating = 'Good';
    summary = 'RAG系统基本正常，有轻微改进空间';
  } else if (score >= 40) {
    rating = 'Fair';
    summary = 'RAG系统需要一些调整才能更好地工作';
  } else {
    summary = 'RAG系统存在明显问题，需要检查配置';
  }

  return { score: Math.round(score), rating, summary, issues, recommendations };
}

// 新增：测试RAG效果的函数
export async function testRAGEffectiveness() {
  console.log('🧪 Testing RAG effectiveness...\n');

  const testQueries = [
    '什么是nginx？',
    '如何配置反向代理？',
    'nginx的主要功能是什么？'
  ];

  for (const query of testQueries) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📋 Query: ${query}`);
    console.log(`${'='.repeat(50)}`);

    try {
      // 使用新的分析函数
      await analyzeRAGEffectiveness(query, true);

    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error);
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log('✅ RAG effectiveness test completed');
  console.log(`${'='.repeat(50)}`);
}
