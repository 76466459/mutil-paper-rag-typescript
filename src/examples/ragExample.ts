/**
 * RAG系统使用示例
 * 此文件演示如何使用RAG系统进行文档问答
 */

import { initializeRagSystem, processQuery, answerQuestion } from '../agents/ragAgent';

/**
 * 演示RAG系统使用的主要示例函数
 */
async function main() {
  try {
    console.log('=== RAG系统示例 ===\n');

    // 步骤1: 使用文档初始化RAG系统
    console.log('1. 初始化RAG系统...');
    await initializeRagSystem('../../tests/');
    console.log('✓ RAG系统初始化成功！\n');

    // 步骤2: 测试简单问答（简单查询的快速方法）
    console.log('2. 测试简单问答...\n');

    const simpleQuestions = [
      '什么是Nginx？',
      '反向代理是如何工作的？',
      'Nginx的主要特性是什么？'
    ];

    for (const question of simpleQuestions) {
      console.log(`Q: ${question}`);
      const answer = await answerQuestion(question);
      console.log(`A: ${answer}\n`);
      console.log('---\n');
    }

    // Step 3: Test advanced RAG agent (more flexible, can do multiple retrievals)
    console.log('3. Testing advanced RAG Agent...\n');

    const complexQuestions = [
      'What is Nginx and what are its key features? Once you explain that, please tell me about its configuration.',
      'How does Nginx handle load balancing and what are the different methods available?'
    ];

    for (const question of complexQuestions) {
      console.log(`Q: ${question}`);
      const response = await processQuery(question);

      console.log('Agent Response:');
      response.forEach((message, index) => {
        console.log(`[Step ${index + 1}]:`);
        if (message.content) {
          console.log(message.content);
        }
        console.log('');
      });
      console.log('---\n');
    }

  } catch (error) {
    console.error('Error in RAG example:', error);
  }
}

/**
 * Interactive chat function for testing the RAG system
 */
async function interactiveChat() {
  try {
    // Initialize RAG system
    await initializeRagSystem('../../tests/');
    console.log('RAG System initialized. You can now ask questions about the loaded documents.');
    console.log('Type "exit" to quit.\n');

    // Simple command-line interface (for demonstration)
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(prompt, (answer) => resolve(answer));
      });
    };

    while (true) {
      const query = await askQuestion('Your question: ');

      if (query.toLowerCase() === 'exit') {
        break;
      }

      if (query.trim() === '') {
        continue;
      }

      try {
        // Use simple Q&A for faster responses
        const answer = await answerQuestion(query);
        console.log(`\nAnswer: ${answer}\n`);
      } catch (error) {
        console.error('Error processing question:', error);
        console.log('Please try again with a different question.\n');
      }
    }

    rl.close();
  } catch (error) {
    console.error('Error in interactive chat:', error);
  }
}

// Export functions for external use
export { main, interactiveChat };

// Run the main example if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}