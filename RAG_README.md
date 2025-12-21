# Multi-Papers RAG System

一个基于 LangChain 的检索增强生成 (RAG) 系统，支持多个 PDF 文档的智能问答。

## 功能特点

- 📚 **多文档支持**: 自动加载和索引指定目录下的所有 PDF 文件
- 🔍 **智能检索**: 基于向量相似度搜索相关文档片段
- 🤖 **RAG Agent**: 使用 Google Gemini 模型的智能代理
- ⚡ **快速问答**: 直接相似度搜索的快速问答模式
- 🔄 **流式响应**: 支持实时流式输出
- 🛠️ **模块化设计**: 易于扩展和自定义

## 系统架构

### 核心组件

1. **文档加载器** (`src/utils/document-loader/PDFLoader.ts`)
   - `loadPDFs()` - 加载 PDF 文档
   - `splitDocuments()` - 文档分块
   - `loadAndSplitPDFs()` - 组合功能

2. **向量存储** (`src/agents/ragAgent.ts`)
   - MemoryVectorStore - 内存向量存储
   - OpenAI Embeddings - 文本向量化

3. **LLM 客户端**
   - OpenAI Embedding Client (`src/utils/llm-client/openaiEmbeddingClient.ts`)
   - Google Gemini Client (`src/utils/llm-client/googleClient.ts`)

4. **RAG 代理** (`src/agents/ragAgent.ts`)
   - `initializeRagSystem()` - 初始化系统
   - `createRagAgent()` - 创建代理
   - `processQuery()` - 处理复杂查询
   - `answerQuestion()` - 快速问答

## 安装依赖

```bash
npm install
```

## 环境配置

在 `.env` 文件中配置 API 密钥：

```env
OPENAI_API_KEY=your-openai-api-key
GOOGLE_API_KEY=your-google-api-key
```

## 使用方法

### 1. 基本使用

```typescript
import { initializeRagSystem, answerQuestion } from './src/agents/ragAgent';

// 初始化系统
await initializeRagSystem('./path/to/pdfs/');

// 提问
const answer = await answerQuestion('什么是 Nginx？');
console.log(answer);
```

### 2. 高级 RAG Agent

```typescript
import { processQuery } from './src/agents/ragAgent';

// 处理复杂查询（可能需要多次检索）
const response = await processQuery(
  '什么是 Nginx？它的主要特性是什么？请详细解释。'
);

// 查看响应流
response.forEach((message, index) => {
  console.log(`步骤 ${index + 1}:`, message.content);
});
```

### 3. 运行示例

```bash
# 运行基本示例
npx ts-node src/examples/ragExample.ts

# 或者交互式模式
# (需要在代码中调用 interactiveChat())
```

## API 参考

### 主要函数

#### `initializeRagSystem(dataPath?: string): Promise<void>`
初始化 RAG 系统，加载并索引文档。

- `dataPath`: PDF 文档目录路径，默认为 '../../tests/'

#### `answerQuestion(query: string): Promise<string>`
快速问答，使用简单的相似度搜索。

- `query`: 用户问题
- 返回: 答案字符串

#### `processQuery(query: string): Promise<Message[]>`
使用 RAG Agent 处理复杂查询。

- `query`: 用户问题
- 返回: 响应消息数组

#### `createRagAgent(): Agent`
创建带有检索工具的 RAG 代理。

- 返回: LangChain Agent 实例

## 自定义配置

### 调整文档分块参数

```typescript
import { loadPDFs, splitDocuments } from './src/utils/document-loader/PDFLoader';

const documents = await loadPDFs('./pdfs/');
const chunks = await splitDocuments(documents, 1500, 300); // 自定义块大小和重叠
```

### 调整检索参数

```typescript
// 在 ragAgent.ts 中修改相似度搜索参数
const retrievedDocs = await vectorStore.similaritySearch(query, 5); // 检索5个文档
```

## 性能优化

1. **内存向量存储**: 适合小到中等规模的文档集合
2. **分块优化**: 调整 `chunkSize` 和 `chunkOverlap` 参数
3. **批量处理**: 对于大量文档，考虑批量处理
4. **缓存**: 可以添加缓存层来存储常见问题的答案

## 扩展功能

### 支持更多文档类型

```typescript
// 在 PDFLoader.ts 中添加其他加载器
const directoryLoader = new DirectoryLoader(dataPath, {
  '.pdf': (path: string) => new PDFLoader(path),
  '.txt': (path: string) => new TextLoader(path),
  '.docx': (path: string) => new DocxLoader(path),
});
```

### 添加其他向量存储

```typescript
import { Chroma } from '@langchain/community/vectorstores/chroma';
// 使用 Chroma 向量数据库
const vectorStore = await Chroma.fromDocuments(allSplits, embeddings);
```

## 故障排除

### 常见问题

1. **API 密钥错误**: 确保正确设置了环境变量
2. **文档路径错误**: 检查 PDF 文档路径是否正确
3. **内存不足**: 对于大型文档集合，考虑使用磁盘向量存储
4. **网络问题**: 确保可以访问 OpenAI 和 Google API

### 调试模式

系统包含详细的日志输出，可以通过控制台查看运行状态和错误信息。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个 RAG 系统！

## 许可证

MIT License