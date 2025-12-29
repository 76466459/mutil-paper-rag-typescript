# RAG 智能问答系统

一个基于 LangChain 的检索增强生成 (RAG) 系统，通过 HTTP API 提供智能文档问答服务。

## ✨ 功能特点

- 🌐 **HTTP API 服务**: 通过 RESTful API 调用 RAG 功能
- 📚 **PDF 文档支持**: 自动加载和索引指定目录下的 PDF 文件
- 🔍 **智能检索**: 基于向量相似度搜索相关文档片段
- 🤖 **LangChain Agent**: 使用现代 RAG Agent 架构
- 🔄 **流式响应**: 支持实时流式输出处理
- 🇨🇳 **中文优化**: 完全中文化的提示词和响应
- ⚡ **高性能**: 使用 `dynamicSystemPromptMiddleware` 优化
- 🧩 **高级分块策略**: 4 种智能分块算法，显著提升检索质量
- 📊 **LangSmith 追踪**: 可选的调试和性能监控（详见 [配置指南](docs/LANGSMITH_SETUP.md)）

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制 `.env.example` 到 `.env` 并配置：

```bash
cp .env.example .env
```

**配置 Embedding 服务（必需）：**

智谱 AI 需要付费，推荐使用免费的硅基流动：

1. 访问 [https://siliconflow.cn/](https://siliconflow.cn/) 注册账号（免费）
2. 获取 API Key
3. 在 `.env` 文件中配置：

```env
SILICONFLOW_API_KEY=sk-your-key-here
```

详细配置说明请查看 [免费 Embedding 配置指南](docs/FREE_EMBEDDING_GUIDE.md)。

**可选：启用 LangSmith 追踪**（用于调试和性能监控）

1. 访问 [https://smith.langchain.com/](https://smith.langchain.com/) 注册账号
2. 获取 API Key
3. 在 `.env` 文件中配置：

```env
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your_langsmith_api_key
LANGCHAIN_PROJECT=rag-system
```

详细配置说明请查看 [LangSmith 配置指南](docs/LANGSMITH_SETUP.md)。

### 3. 准备文档

将PDF文档放入 `tests/` 目录：
```
tests/
├── nginx_v2.pdf          # 示例文档
└── your-document.pdf     # 你的文档
```

### 4. 启动服务

```bash
# 启动 RAG HTTP 服务器
npm start

# 或者直接使用 tsx
node --import tsx src/main.ts
```

启动成功后会看到：
```
🚀 启动RAG系统...
Initializing RAG system...
RAG system initialized with X document chunks.
✅ RAG系统初始化完成
🌐 RAG服务器已启动
📍 健康检查: http://localhost:3000/health
🔍 查询接口: http://localhost:3000/query
💡 使用方法: POST {"query": "你的问题"} 到 /query 接口
```

## 📚 API 文档

### 接口列表

#### 1. 健康检查

**GET** `/health`

检查服务是否正常运行。

**响应示例:**
```json
{
  "status": "healthy",
  "message": "RAG系统运行正常"
}
```

#### 2. 智能问答

**POST** `/query`

使用 RAG 系统回答用户问题。

**请求体:**
```json
{
  "query": "什么是 Nginx？"
}
```

**响应示例:**
```json
{
  "success": true,
  "query": "什么是 Nginx？",
  "response": [
    {
      "role": "assistant",
      "content": "Nginx 是一个高性能的 Web 服务器..."
    }
  ]
}
```

**错误响应:**
```json
{
  "error": "缺少query参数"
}
```

## 🛠️ 使用方法

### 1. curl 命令

```bash
# 健康检查
curl http://localhost:3000/health

# 发送查询
curl -X POST http://localhost:3000/query \
  -H "Content-Type: application/json" \
  -d '{"query": "什么是Nginx？"}'
```

### 2. JavaScript/Fetch

```javascript
// 健康检查
const health = await fetch('http://localhost:3000/health');
console.log(await health.json());

// 发送查询
const response = await fetch('http://localhost:3000/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Nginx的主要功能是什么？'
  })
});
const result = await response.json();
console.log(result.response);
```

### 3. Postman

1. 创建 POST 请求到 `http://localhost:3000/query`
2. 设置 Headers: `Content-Type: application/json`
3. 设置 Body (raw JSON):
```json
{
  "query": "你的问题"
}
```

## 📁 项目结构

```
src/
├── agents/
│   └── ragAgent.ts           # RAG系统核心逻辑
├── utils/
│   ├── document-loader/
│   │   └── PDFLoader.ts      # PDF文档加载和处理
│   └── llm-client/
│       └── glmClient.ts      # 智谱GLM客户端
├── prompts/
│   ├── index.ts              # 提示词统一导出
│   ├── retrievePrompts.ts    # 检索相关提示词
│   ├── qaPrompts.ts          # 问答相关提示词
│   └── promptUtils.ts        # 提示词工具函数
├── main.ts                   # HTTP服务器入口
└── tests/                    # PDF文档目录
    └── nginx_v2.pdf          # 示例文档
```

## ⚙️ 配置选项

### 环境变量

```env
PORT=3000                    # 服务器端口（可选，默认3000）
CHUNKING_STRATEGY=smart      # 分块策略：semantic | sliding | hierarchical | smart
```

### 分块策略选择

系统支持 4 种高级分块策略：

1. **semantic** - 语义分块：基于段落和句子边界，保持语义完整性
2. **sliding** - 滑动窗口：使用重叠窗口确保上下文连续性
3. **hierarchical** - 层次化分块：创建父子关系，保留文档结构
4. **smart** - 智能分块（推荐）：自动检测文档类型，选择最佳策略

详细说明请查看：[高级分块策略文档](docs/ADVANCED_CHUNKING.md)

### 对比测试分块策略

```bash
npx tsx scripts/compareChunkingStrategies.ts
```

### 修改文档路径

编辑 `src/main.ts` 第7行：
```typescript
await initializeRagSystem('./tests/', 'smart');  // 第二个参数指定分块策略
```

### 调整检索参数

编辑 `src/agents/ragAgent.ts` 第30行：
```typescript
const retrievedDocs = await vectorStore.similaritySearch(lastQuery, 3); // 调整检索文档数量
```

### 调整文档分块

编辑 `src/agents/ragAgent.ts` 第13行：
```typescript
const allSplits = await splitDocuments(documents, 1000, 200); // chunkSize=1000, chunkOverlap=200
```

## 🌟 示例问题

基于默认的 `tests/nginx_v2.pdf` 文档，可以询问：

- `什么是 Nginx？`
- `Nginx 的主要功能是什么？`
- `如何配置反向代理？`
- `Nginx 的负载均衡算法有哪些？`
- `如何优化 Nginx 的性能？`
- `Nginx 和 Apache 的区别是什么？`

## 🛠️ 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   Error: listen EADDRINUSE :::3000
   ```
   解决：修改端口 `PORT=3001 node --import tsx src/main.ts`

2. **文档路径错误**
   ```
   Error: ENOENT: no such file or directory
   ```
   解决：检查 `tests/` 目录是否存在PDF文件

3. **API 密钥错误**
   ```
   Authentication failed
   ```
   解决：检查 `src/utils/llm-client/glmClient.ts` 中的API密钥

4. **内存不足**
   ```
   JavaScript heap out of memory
   ```
   解决：减少文档数量或增加内存限制 `--max-old-space-size=4096`

### 调试模式

系统启动后会显示详细日志，包括：
- 文档加载状态
- 检索过程
- 查询处理步骤

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发步骤

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 开启 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [LangChain](https://langchain.com/) - 强大的LLM应用开发框架
- [智谱AI](https://zhipuai.cn/) - 提供GLM大语言模型API
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的JavaScript