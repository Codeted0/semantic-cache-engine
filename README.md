# CacheFlow: Semantic Caching Engine for LLMs 🚀

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Upstash](https://img.shields.io/badge/Upstash-Vector-00E9A3?style=for-the-badge&logo=redis&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

> **Reduce LLM API costs by ~40% and latency by 90% using Vector Embeddings and Semantic Search.**

## 💡 The Problem
LLM APIs (like OpenAI or Gemini) are **stateless** and **expensive**.
If 1,000 users ask *"What is the capital of France?"*, the company pays for 1,000 API calls. Traditional caching (Redis key-value) fails here because it cannot understand that *"Capital of France"* and *"What is France's capital?"* are the same question.

## ⚡ The Solution: CacheFlow
CacheFlow is an intelligent middleware that sits between the user and the LLM. It uses **Vector Embeddings** and **Cosine Similarity** to detect the *intent* of a query.
* If a similar question (similarity > 0.90) exists in the Vector Database, it returns the cached answer instantly (**<50ms**).
* If not, it calls the LLM, caches the result, and serves future users for free.

---

## 🏗️ System Architecture

```mermaid
graph LR
    A[User Frontend] -->|1. Question| B(Node.js Server)
    B -->|2. Generate Embedding| C[Local Transformer Model]
    B -->|3. Vector Search| D[(Upstash Vector DB)]
    
    D -- Hit (Score > 0.9) --> B
    D -- Miss --> E[Google Gemini API]
    
    E -->|4. Generate Answer| B
    B -->|5. Save to Cache| D
    B -->|6. Return Response| A
