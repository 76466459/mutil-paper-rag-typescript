import { initializeRagSystem, processQuery, testRAGEffectiveness, analyzeRAGEffectiveness } from './agents/ragAgent';
import { createServer } from 'http';

async function main() {
  try {
    console.log('🚀 启动RAG系统...');
    await initializeRagSystem('../tests/');
    console.log('✅ RAG系统初始化完成');

    const PORT = process.env.PORT || 3000;

    const server = createServer(async (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'healthy', message: 'RAG系统运行正常' }));
        return;
      }

      if (req.url === '/test') {
        try {
          let body = '';

          if (req.method === 'POST') {
            req.on('data', chunk => {
              body += chunk.toString();
            });

            req.on('end', async () => {
              try {
                const { query, debug = true } = JSON.parse(body);

                if (!query) {
                  res.writeHead(400);
                  res.end(JSON.stringify({ error: '缺少query参数' }));
                  return;
                }

                console.log(`🧪 Testing RAG for query: ${query}`);

                // 执行详细的RAG效果测试
                const ragAnalysis = await analyzeRAGEffectiveness(query, debug);

                res.writeHead(200);
                res.end(JSON.stringify({
                  success: true,
                  query,
                  analysis: ragAnalysis,
                  message: `RAG效果分析完成，查看details字段了解详情`
                }));
              } catch (parseError) {
                console.error('Test parse error:', parseError);
                res.writeHead(400);
                res.end(JSON.stringify({ error: '请求格式错误' }));
              }
            });
          } else if (req.method === 'GET') {
            // GET方法运行默认测试
            console.log('🧪 Running default RAG effectiveness test...');
            await testRAGEffectiveness();

            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              message: 'RAG效果测试完成，请查看控制台输出'
            }));
          }
        } catch (error) {
          console.error('Test failed:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: '测试失败' }));
        }
        return;
      }

      if (req.method === 'POST' && req.url === '/query') {
        try {
          let body = '';
          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const { query } = JSON.parse(body);

              if (!query) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: '缺少query参数' }));
                return;
              }

              console.log(`🔍 收到查询: ${query}`);
              const response = await processQuery(query);

              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                query,
                response
              }));
            } catch (parseError) {
              console.error('解析请求失败:', parseError);
              res.writeHead(400);
              res.end(JSON.stringify({ error: '请求格式错误' }));
            }
          });
        } catch (error) {
          console.error('处理查询失败:', error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: '服务器内部错误' }));
        }
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: '接口不存在' }));
    });

    server.listen(PORT, () => {
      console.log(`🌐 RAG服务器已启动`);
      console.log(`📍 健康检查: http://localhost:${PORT}/health`);
      console.log(`🧪 RAG测试: http://localhost:${PORT}/test`);
      console.log(`🔍 查询接口: http://localhost:${PORT}/query`);
      console.log(`💡 使用方法: POST {"query": "你的问题"} 到 /query 接口`);
      console.log(`📊 测试RAG效果: 访问 /test 接口查看详细调试信息`);
    });

  } catch (error) {
    console.error('❌ 系统启动失败:', error);
    process.exit(1);
  }
}

main().catch(console.error);
