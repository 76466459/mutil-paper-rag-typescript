# LangSmith 追踪演示

## 快速体验

### 1. 不启用追踪（默认）

```bash
# .env 文件中
LANGCHAIN_TRACING_V2=false

# 启动服务
npm start

# 发送查询
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "什么是 Nginx？"}'
```

**控制台输出：**
```
🔍 Processing query: 什么是 Nginx？
📚 Retrieved 3 documents:
--- Document 1 ---
Source: tests/nginx_v2.pdf
...
✅ Final answer length: 456 characters
```

### 2. 启用追踪

```bash
# .env 文件中
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls_xxx_your_key
LANGCHAIN_PROJECT=rag-demo

# 启动服务
npm start

# 发送查询
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "什么是 Nginx？"}'
```

**控制台输出（相同）：**
```
🔍 Processing query: 什么是 Nginx？
📚 Retrieved 3 documents:
...
```

**但是！** 现在你可以在 LangSmith 网站上看到：

## LangSmith 界面展示

访问 https://smith.langchain.com/projects/rag-demo

### 追踪列表视图

```
┌─────────────────────────────────────────────────────────────┐
│ Traces                                                      │
├─────────────────────────────────────────────────────────────┤
│ ⏱️  2024-12-26 10:30:15  │  什么是 Nginx？  │  1.2s  │  ✅  │
│ ⏱️  2024-12-26 10:28:42  │  如何配置反向代理？│  1.5s  │  ✅  │
│ ⏱️  2024-12-26 10:25:10  │  Nginx 的主要功能 │  1.1s  │  ✅  │
└─────────────────────────────────────────────────────────────┘
```

### 点击任意追踪查看详情

```
📊 Trace Details: 什么是 Nginx？
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Step 1: Vector Search (120ms)
├─ Input Query: "什么是 Nginx？"
├─ Vector Store: MemoryVectorStore
├─ Top K: 3
└─ Results:
   ├─ Document 1 (similarity: 0.89)
   │  Source: tests/nginx_v2.pdf
   │  Content: "Nginx 是一个高性能的 HTTP 和反向代理服务器..."
   │  Length: 1000 chars
   │
   ├─ Document 2 (similarity: 0.85)
   │  Source: tests/nginx_v2.pdf
   │  Content: "Nginx 的主要特点包括：1. 高并发处理能力..."
   │  Length: 950 chars
   │
   └─ Document 3 (similarity: 0.82)
      Source: tests/nginx_v2.pdf
      Content: "Nginx 可以作为负载均衡器使用..."
      Length: 800 chars

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 Step 2: LLM Call (1.1s)
├─ Model: glm-4-flash
├─ Temperature: 0.7
├─ Max Tokens: 2000
│
├─ System Prompt:
│  "你是一个有用的助手。请基于以下上下文来回答用户的问题。
│   
│   上下文：
│   Nginx 是一个高性能的 HTTP 和反向代理服务器...
│   Nginx 的主要特点包括：1. 高并发处理能力...
│   Nginx 可以作为负载均衡器使用...
│   
│   请用中文回答用户的问题。"
│
├─ User Message:
│  "什么是 Nginx？"
│
├─ Token Usage:
│  ├─ Input: 1,234 tokens
│  ├─ Output: 456 tokens
│  └─ Total: 1,690 tokens
│
└─ Response:
   "Nginx 是一个高性能的 Web 服务器和反向代理服务器，由俄罗斯
    程序员 Igor Sysoev 开发。它以其出色的性能、稳定性和低资源
    消耗而闻名。Nginx 的主要功能包括：
    
    1. HTTP 服务器：可以作为静态文件服务器
    2. 反向代理：支持 HTTP、HTTPS、TCP 等协议
    3. 负载均衡：支持多种负载均衡算法
    4. 缓存：提供高效的缓存机制
    
    Nginx 特别适合高并发场景，能够处理数万个并发连接..."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 Performance Metrics:
├─ Total Duration: 1.22s
├─ Vector Search: 120ms (9.8%)
├─ LLM Call: 1,100ms (90.2%)
└─ Status: ✅ Success

💰 Cost Estimate:
├─ Input Tokens: 1,234 × $0.0001 = $0.0001234
├─ Output Tokens: 456 × $0.0002 = $0.0000912
└─ Total: $0.0002146

🏷️ Metadata:
├─ Project: rag-demo
├─ Environment: development
├─ User Agent: curl/7.68.0
└─ Timestamp: 2024-12-26T10:30:15.123Z
```

## 对比：有无追踪的区别

### 无追踪（默认）
- ✅ 更快（无网络开销）
- ✅ 更私密（数据不离开本地）
- ❌ 无法可视化调试
- ❌ 无法分析性能
- ❌ 无法追溯历史查询

### 有追踪
- ✅ 完整的可视化调试
- ✅ 性能分析和优化
- ✅ 历史记录和回放
- ✅ 团队协作和分享
- ⚠️ 轻微性能开销（~50ms）
- ⚠️ 数据上传到云端

## 实际使用场景

### 开发阶段 → 启用追踪
```env
LANGCHAIN_TRACING_V2=true
```
用于调试、优化 Prompt、分析检索质量

### 生产环境 → 可选
```env
LANGCHAIN_TRACING_V2=false  # 或采样追踪
```
根据需求决定是否启用

## 高级：采样追踪

只追踪 10% 的请求（节省成本）：

```typescript
// 在 processQuery 函数中
const shouldTrace = Math.random() < 0.1;
process.env.LANGCHAIN_TRACING_V2 = shouldTrace ? 'true' : 'false';
```

## 总结

LangSmith 追踪就像给你的 RAG 系统装上了"X光机"，让你能看到内部的每一个步骤。强烈建议在开发时启用！
