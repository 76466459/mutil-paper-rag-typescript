# 免费 Embedding 服务配置指南

智谱 AI 余额不足？这里有几个完全免费的替代方案！

## 🎯 推荐方案：硅基流动（SiliconFlow）

**优点：**
- ✅ 完全免费（每月免费额度）
- ✅ 支持中文
- ✅ 国内访问快
- ✅ OpenAI 兼容接口
- ✅ 无需信用卡

### 配置步骤

#### 1. 注册账号

访问 [https://siliconflow.cn/](https://siliconflow.cn/) 注册账号

#### 2. 获取 API Key

1. 登录后，点击右上角头像
2. 选择 **API 密钥管理**
3. 点击 **创建新密钥**
4. 复制生成的 API Key（格式：`sk-xxxxx`）

#### 3. 配置环境变量

编辑 `.env` 文件：

```env
# 硅基流动 API Key
SILICONFLOW_API_KEY=sk-your-siliconflow-key-here
```

#### 4. 修改代码

编辑 `src/agents/ragAgent.ts`：

```typescript
// 将这行
import { embedding_3, model } from '../utils/llm-client/glmClient';

// 改为
import { siliconflowEmbedding as embedding_3 } from '../utils/llm-client/freeEmbeddingClient';
import { model } from '../utils/llm-client/glmClient';
```

#### 5. 重启服务

```bash
npm start
```

完成！现在你的 RAG 系统使用免费的 Embedding 服务了。

---

## 备选方案 1：OpenAI（新用户有 $5 免费额度）

### 配置步骤

#### 1. 注册 OpenAI 账号

访问 [https://platform.openai.com/signup](https://platform.openai.com/signup)

新用户会获得 $5 免费额度（足够测试使用）

#### 2. 获取 API Key

1. 访问 [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. 点击 **Create new secret key**
3. 复制 API Key

#### 3. 配置环境变量

```env
OPENAI_API_KEY=sk-your-openai-key-here
```

#### 4. 修改代码

```typescript
import { openaiEmbedding as embedding_3 } from '../utils/llm-client/freeEmbeddingClient';
import { model } from '../utils/llm-client/glmClient';
```

---

## 备选方案 2：HuggingFace（完全免费）

### 配置步骤

#### 1. 注册 HuggingFace 账号

访问 [https://huggingface.co/join](https://huggingface.co/join)

#### 2. 获取 Access Token

1. 访问 [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. 点击 **New token**
3. 选择 **Read** 权限
4. 复制 Token（格式：`hf_xxxxx`）

#### 3. 安装依赖

```bash
npm install @huggingface/inference
```

#### 4. 配置环境变量

```env
HUGGINGFACE_API_KEY=hf_your_token_here
```

#### 5. 修改代码

```typescript
import { hfEmbedding as embedding_3 } from '../utils/llm-client/huggingfaceClient';
import { model } from '../utils/llm-client/glmClient';
```

---

## 方案对比

| 方案 | 免费额度 | 中文支持 | 速度 | 推荐度 |
|------|---------|---------|------|--------|
| 硅基流动 | ⭐⭐⭐⭐⭐ | ✅ 优秀 | ⚡ 快 | ⭐⭐⭐⭐⭐ |
| OpenAI | ⭐⭐⭐ ($5) | ✅ 良好 | ⚡ 快 | ⭐⭐⭐⭐ |
| HuggingFace | ⭐⭐⭐⭐⭐ | ✅ 良好 | 🐢 较慢 | ⭐⭐⭐ |

---

## 成本估算

### 硅基流动免费额度

- 每月免费 Embedding 调用：约 100 万 tokens
- 你的项目每次查询约消耗：3,000 tokens
- 可支持查询次数：约 300+ 次/月

**完全够用！**

### OpenAI 免费额度

- $5 免费额度
- text-embedding-3-small 价格：$0.00002/1K tokens
- 可支持查询次数：约 80,000 次

**非常够用！**

---

## 快速切换脚本

我已经为你准备好了所有配置，只需要：

1. 选择一个方案并获取 API Key
2. 在 `.env` 中配置
3. 修改 `src/agents/ragAgent.ts` 的 import 语句
4. 重启服务

就这么简单！

---

## 故障排除

### 硅基流动 API 调用失败

```
Error: 401 Unauthorized
```

**解决：** 检查 API Key 是否正确，确保已复制完整的 key

### OpenAI API 调用失败

```
Error: Incorrect API key provided
```

**解决：** 检查 API Key 格式，应该以 `sk-` 开头

### HuggingFace 速度慢

**解决：** HuggingFace 免费 API 有速率限制，建议使用硅基流动或 OpenAI

---

## 推荐配置（最佳实践）

```env
# .env 文件

# 主要使用硅基流动（免费 + 快速）
SILICONFLOW_API_KEY=sk-your-key-here

# 备用 OpenAI（有免费额度）
OPENAI_API_KEY=sk-your-key-here

# LangSmith 追踪（可选）
LANGCHAIN_TRACING_V2=false
```

```typescript
// src/agents/ragAgent.ts

// 使用硅基流动
import { siliconflowEmbedding as embedding_3 } from '../utils/llm-client/freeEmbeddingClient';
import { model } from '../utils/llm-client/glmClient';
```

这样配置后，你的 RAG 系统就可以完全免费运行了！🎉
