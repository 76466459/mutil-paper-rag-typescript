import { loadPDFs } from '../src/utils/document-loader/PDFLoader';
import { ChunkerFactory } from '../src/utils/document-loader/AdvancedChunker';

async function compareStrategies() {
  console.log('📊 分块策略对比测试\n');
  console.log('='.repeat(80));
  
  // 加载文档
  const documents = await loadPDFs('./tests/');
  const totalChars = documents.reduce((sum, doc) => sum + doc.pageContent.length, 0);
  
  console.log(`\n📄 文档信息:`);
  console.log(`  - 文档数量: ${documents.length}`);
  console.log(`  - 总字符数: ${totalChars.toLocaleString()}`);
  console.log(`  - 平均文档长度: ${Math.round(totalChars / documents.length).toLocaleString()} 字符\n`);
  
  const strategies = ChunkerFactory.listStrategies();
  const results: any[] = [];
  
  for (const strategy of strategies) {
    console.log('='.repeat(80));
    console.log(`\n🔍 测试策略: ${strategy.toUpperCase()}\n`);
    
    const chunker = ChunkerFactory.create(strategy as any);
    console.log(`策略名称: ${chunker.name}`);
    console.log(`策略描述: ${chunker.description}\n`);
    
    const startTime = Date.now();
    const chunks = await chunker.chunk(documents);
    const duration = Date.now() - startTime;
    
    // 统计信息
    const chunkLengths = chunks.map(c => c.pageContent.length);
    const avgLength = chunkLengths.reduce((a, b) => a + b, 0) / chunks.length;
    const minLength = Math.min(...chunkLengths);
    const maxLength = Math.max(...chunkLengths);
    const stdDev = Math.sqrt(
      chunkLengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / chunks.length
    );
    
    const result = {
      strategy: chunker.name,
      totalChunks: chunks.length,
      avgLength: Math.round(avgLength),
      minLength,
      maxLength,
      stdDev: Math.round(stdDev),
      duration,
      compressionRatio: (totalChars / chunks.length).toFixed(1)
    };
    
    results.push(result);
    
    console.log(`📈 统计结果:`);
    console.log(`  - 总块数: ${result.totalChunks}`);
    console.log(`  - 平均长度: ${result.avgLength} 字符`);
    console.log(`  - 最小长度: ${result.minLength} 字符`);
    console.log(`  - 最大长度: ${result.maxLength} 字符`);
    console.log(`  - 标准差: ${result.stdDev} 字符`);
    console.log(`  - 处理时间: ${result.duration}ms`);
    console.log(`  - 压缩比: ${result.compressionRatio}:1\n`);
    
    // 显示前3个块的预览
    console.log(`📝 块预览 (前3个):`);
    chunks.slice(0, 3).forEach((chunk, idx) => {
      const preview = chunk.pageContent.slice(0, 100).replace(/\n/g, ' ');
      console.log(`  ${idx + 1}. [${chunk.pageContent.length} 字符] ${preview}...`);
    });
    console.log();
  }
  
  // 对比总结
  console.log('='.repeat(80));
  console.log('\n📊 策略对比总结\n');
  console.log('策略名称'.padEnd(30) + '块数'.padEnd(10) + '平均长度'.padEnd(12) + '标准差'.padEnd(10) + '耗时');
  console.log('-'.repeat(80));
  
  results.forEach(r => {
    console.log(
      r.strategy.padEnd(30) +
      r.totalChunks.toString().padEnd(10) +
      r.avgLength.toString().padEnd(12) +
      r.stdDev.toString().padEnd(10) +
      `${r.duration}ms`
    );
  });
  
  console.log('\n' + '='.repeat(80));
  
  // 推荐建议
  console.log('\n💡 推荐建议:\n');
  
  const bestForConsistency = results.reduce((a, b) => a.stdDev < b.stdDev ? a : b);
  const bestForSpeed = results.reduce((a, b) => a.duration < b.duration ? a : b);
  const mostChunks = results.reduce((a, b) => a.totalChunks > b.totalChunks ? a : b);
  
  console.log(`  ✓ 最一致的分块: ${bestForConsistency.strategy} (标准差: ${bestForConsistency.stdDev})`);
  console.log(`  ✓ 最快的处理: ${bestForSpeed.strategy} (${bestForSpeed.duration}ms)`);
  console.log(`  ✓ 最细粒度: ${mostChunks.strategy} (${mostChunks.totalChunks} 块)`);
  console.log(`\n  推荐使用: Smart Chunking (智能分块) - 综合性能最佳\n`);
  
  console.log('='.repeat(80));
}

compareStrategies().catch(console.error);
