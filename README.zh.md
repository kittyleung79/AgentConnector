<p align='center'>
<img src='./build/icon.png' width="150" height="150" alt="AgentConnector AI助手图标" />
</p>

<h1 align="center">AgentConnector - 强大的开源多模型智能体客户端</h1>

<p align="center">AgentConnector是一个功能丰富的开源AI智能体客户端，支持多种云端和本地大语言模型，提供强大的搜索增强和工具调用能力。</p>

<div align="center">
  <a href="./README.zh.md">中文</a> / <a href="./README.md">English</a>
</div>

## 📑 目录

- [📑 目录](#-目录)
- [🚀 项目简介](#-项目简介)
- [💡 为什么选择AgentConnector](#-为什么选择AgentConnector)
- [🔥 主要功能](#-主要功能)
- [🤖 支持的模型提供商](#-支持的模型提供商)
  - [兼容任何OpenAI/Gemini/Anthropic API格式的模型提供商](#兼容任何openaigeminianthropic-api格式的模型提供商)
- [🔍 使用场景](#-使用场景)
- [📦 快速开始](#-快速开始)
  - [下载安装](#下载安装)
  - [配置模型](#配置模型)
  - [开始对话](#开始对话)
- [💻 开发指南](#-开发指南)
  - [安装依赖](#安装依赖)
  - [开始开发](#开始开发)
  - [构建](#构建)
- [🙏🏻 Thanks](#-Thanks)
- [📃 许可证](#-许可证)

## 🚀 项目简介

AgentConnector 是一款功能丰富的开源AI对话平台，它基于DeepChat构建，支持智能体网络接入的同时支持接入多种云端和本地大语言模型，并具备强大的搜索增强与工具调用能力。

作为一个跨平台的AI助手应用，AgentConnector不仅支持基础的聊天功能，还提供了搜索增强、工具调用、多模态交互等高级特性，让AI能力的应用更加便捷和高效。

## 💡 为什么选择AgentConnector

与其他AI工具相比，AgentConnector具有以下独特优势：

- **全面继承DeepChat核心功能**：基于健壮的DeepChat框架构建，完整继承了其所有强大的对话能力与用户体验优势，提供成熟稳定的交互基础，实现开箱即用。
- **无缝集成AgentDNS生态**：原生设计支持连接AgentDNS系统，能够自动发现并动态路由至最合适的智能服务，实现真正的"智能体级"互联协作。
- **内置MCP支持的先进工具调用**：集成模型上下文协议，支持代码执行、网络访问及多种可扩展工具，无需复杂配置即可使用。
- **灵活强大的搜索增强功能**：支持多搜索引擎并提供可定制的搜索范式，显著提升AI回复的准确性与时效性。
- **隐私优先的设计理念**：通过本地数据存储和网络代理支持，有效降低数据泄露风险，切实保障用户隐私。
- **商业友好的开源许可**：基于Apache 2.0许可证发布，免费用于商业及个人场景，提供最大程度使用灵活性。

## 🔥 主要功能
- **与AgentDNS深度集成**：动态连接智能体网络，实现服务自动发现、智能路由和统一调度。

AgentConnector完整继承了DeepChat的核心对话功能，这使我们能够站在巨人的肩膀上。这一战略基础让我们避免了重复开发，从而将研发精力集中于突破性功能——如AgentDNS集成和增强的工具调用能力，为用户创造更大价值。

- 🌐 **多种云端LLM提供商支持**：DeepSeek、OpenAI、SiliconFlow、Grok、Gemini、Anthropic等
- 🏠 **本地模型部署支持**：
  - 集成Ollama，提供全面的管理功能
  - 无需命令行操作即可控制和管理Ollama模型的下载、部署和运行
- 🚀 **丰富易用的聊天功能**
  - 完整的Markdown渲染，代码块渲染基于业界顶级的 [CodeMirror](https://codemirror.net/) 实现
  - 多窗口+多Tab架构，各个维度支持多会话并行运行，就像使用浏览器一样使用大模型，无阻塞的体验带来了优异的效率
  - 支持 Artifacts 渲染，多样化结果展示，MCP集成后显著节省token消耗
  - 消息支持重试生成多个变体；对话可自由分支，确保总有合适的思路
  - 支持渲染图像、Mermaid图表等多模态内容；支持GPT-4o,Gemini,Grok的文本到图像功能
  - 支持在内容中高亮显示搜索结果等外部信息源
- 🔍 **强大的搜索扩展能力**
  - 通过MCP模式内置集成博查搜索、Brave Search等 领先搜索API，让模型智能决定何时搜索
  - 通过模拟用户网页浏览，支持Google、Bing、百度、搜狗公众号搜索等主流搜索引擎，使LLM能像人类一样阅读搜索引擎
  - 支持读取任何搜索引擎；只需配置搜索助手模型，即可连接各种搜索源，无论是内部网络、无API的引擎，还是垂直领域搜索引擎，作为模型的信息源
- 🔧 **出色的MCP（Model Context Protocol）支持**
  - 完整支持了 MCP 协议中 Resources/Prompts/Tools 三大核心能力
  - 支持语义工作流，通过理解任务的意义和上下文，实现更复杂和智能的自动化
  - 极其用户友好的配置界面
  - 美观清晰的工具调用显示
  - 详细的工具调用调试窗口，自动格式化工具参数和返回数据
  - 内置 Node.js 运行环境；类似 npx/node 的服务无需额外配置开箱即用
  - 支持 StreamableHTTP/SSE/Stdio 协议 Transports
  - 支持 inMemory 服务，内置代码执行、网络信息获取、文件操作等实用工具；开箱即用，无需二次安装即可满足大多数常见用例
  - 通过内置 MCP 服务，将视觉模型能力转换为任何模型都可通用的函数
- 💻 **多平台支持**：Windows、macOS、Linux
- 🎨 **美观友好的界面**，以用户为中心的设计，精心设计的明暗主题
- 🔗 **丰富的DeepLink支持**：通过链接发起对话，与其他应用无缝集成。还支持一键安装MCP服务，简单快速
- 🚑 **安全优先设计**：聊天数据和配置数据预留加密接口和代码混淆能力
- 🛡️ **隐私保护**：支持屏幕投影隐藏、网络代理等隐私保护方法，降低信息泄露风险
- 💰 **商业友好**：
  - 拥抱开源，基于 Apache License 2.0 协议，企业使用安心无忧
  - 企业集成只需要修改极少配置代码即可使用预留的加密混淆的安全能力
  - 代码结构清晰，无论是模型供应商还是 MCP 服务都高度解耦，可以随意进行增删定制，成本极低
  - 架构合理，数据交互和UI行为分离，充分利用 Electron 的能力，拒绝简单的网页套壳，性能优异

## 🤖 支持的模型提供商

<table>
  <tr align="center">
    <td>
      <img src="./src/renderer/src/assets/llm-icons/ollama.svg" width="50" height="50" alt="Ollama图标"><br/>
      <a href="https://ollama.com">Ollama</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/deepseek-color.svg" width="50" height="50" alt="Deepseek图标"><br/>
      <a href="https://deepseek.com/">Deepseek</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/ppio-color.svg" width="50" height="50" alt="PPIO图标"><br/>
      <a href="https://ppinfra.com/">PPIO</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/alibabacloud-color.svg" width="50" height="50" alt="DashScope图标"><br/>
      <a href="https://www.aliyun.com/product/bailian">DashScope</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <img src="./src/renderer/src/assets/llm-icons/doubao-color.svg" width="50" height="50" alt="Doubao图标"><br/>
      <a href="https://console.volcengine.com/ark/">Doubao</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/minimax-color.svg" width="50" height="50" alt="MiniMax图标"><br/>
      <a href="https://platform.minimaxi.com/">MiniMax</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/fireworks-color.svg" width="50" height="50" alt="Fireworks图标"><br/>
      <a href="https://fireworks.ai/">Fireworks</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/302ai.svg" width="50" height="50" alt="302.AI图标"><br/>
      <a href="https://302.ai/">302.AI</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <img src="./src/renderer/src/assets/llm-icons/openai.svg" width="50" height="50" alt="OpenAI图标"><br/>
      <a href="https://openai.com/">OpenAI</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/gemini-color.svg" width="50" height="50" alt="Gemini图标"><br/>
      <a href="https://gemini.google.com/">Gemini</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/github.svg" width="50" height="50" alt="GitHub Models图标"><br/>
      <a href="https://github.com/marketplace/models">GitHub Models</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/moonshot.svg" width="50" height="50" alt="Moonshot图标"><br/>
      <a href="https://moonshot.ai/">Moonshot</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <img src="./src/renderer/src/assets/llm-icons/openrouter.svg" width="50" height="50" alt="OpenRouter图标"><br/>
      <a href="https://openrouter.ai/">OpenRouter</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/azure-color.svg" width="50" height="50" alt="Azure OpenAI图标"><br/>
      <a href="https://azure.microsoft.com/en-us/products/ai-services/openai-service">Azure OpenAI</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/qiniu.svg" width="50" height="50" alt="Qiniu图标"><br/>
      <a href="https://www.qiniu.com/products/ai-token-api">Qiniu</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/grok.svg" width="50" height="50" alt="Grok图标"><br/>
      <a href="https://x.ai/">Grok</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <img src="./src/renderer/src/assets/llm-icons/zhipu-color.svg" width="50" height="50" alt="智谱图标"><br/>
      <a href="https://open.bigmodel.cn/">智谱</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/siliconcloud.svg" width="50" height="50" alt="SiliconFlow图标"><br/>
      <a href="https://www.siliconflow.cn/">SiliconFlow</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/aihubmix.png" width="50" height="50" alt="AIHubMix图标"><br/>
      <a href="https://aihubmix.com/">AIHubMix</a>
    </td>
    <td>
      <img src="./src/renderer/src/assets/llm-icons/hunyuan-color.svg" width="50" height="50" alt="混元图标"><br/>
      <a href="https://cloud.tencent.com/product/hunyuan">混元</a>
    </td>
  </tr>
  <tr align="center">
    <td>
      <img src="./src/renderer/src/assets/llm-icons/lmstudio.svg" width="50" height="50" alt="LM Studio图标"><br/>
      <a href="https://lmstudio.ai/">LM Studio</a>
    </td>
    <td></td>
    <td></td>
    <td></td>
  </tr>

</table>

### 兼容任何OpenAI/Gemini/Anthropic API格式的模型提供商

## 🔍 使用场景

AgentConnector适用于多种AI应用场景：

- **智能体注册与发现**: 接入智能体网络、自主发现、自主回答、会话流程控制、任务分配与执⾏
- **日常助手**：回答问题、提供建议、辅助写作和创作
- **开发辅助**：代码生成、调试、技术问题解答
- **学习工具**：概念解释、知识探索、学习辅导
- **内容创作**：文案撰写、创意激发、内容优化
- **数据分析**：数据解读、图表生成、报告撰写

## 📦 快速开始

### 下载安装

从[GitHub Releases](https://github.com/jsjfai)页面下载适合您系统的最新版本：

- Windows: `.exe`安装文件
- macOS: `.dmg`安装文件

### 配置模型

1. 启动AgentConnector应用
2. 点击设置图标
3. 选择"模型提供商"选项卡
4. 添加您的API密钥或配置本地Ollama

### 开始对话

1. 点击"+"按钮创建新对话
2. 选择您想使用的模型
3. 开始与AI助手交流

## 💻 开发指南
### 安装依赖

```bash
# 使用国内镜像源安装依赖
## Mac/Linux 
npm config set registry https://registry.npmmirror.com/
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
## Windows
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"
npm config set registry https://registry.npmmirror.com/

# （可选）彻底清除环境 MAC/Linux
rm -rf "$(pnpm store path)"
rm -rf node_modules ~/.pnpm-store ~/.cache/electron
# （可选）彻底清除环境 Windows
$storePath = pnpm store path
Remove-Item -Recurse -Force -Path $storePath
Remove-Item -Recurse -Force -Path .\node_modules

# 安装依赖
pnpm install
pnpm run installRuntime:cn
# 如果出现错误：No module named 'distutils'
pip install setuptools
```

* For Windows: 为允许非管理员用户创建符号链接和硬链接，请在设置中开启``开发者模式``或使用管理员账号，否则 ``pnpm`` 操作将失败。

### 开始开发

```bash
pnpm run dev
```

### 构建

```bash
# Windows
pnpm run build:win:x64:cn
# 如果Windows Visual Studio 的构建工具缺失，执行以下命令安装
winget install Microsoft.VisualStudio.2022.BuildTools --override "--passive --add Microsoft.VisualStudio.Workload.VCTools"

# MacOS
pnpm run build:mac

# Linux
pnpm run build:linux

# 指定架构打包
pnpm run build:win:x64:cn
pnpm run build:mac:arm64
pnpm run build:linux:x64
pnpm run build:linux:arm64
```

## 👥 社区与贡献
AgentConnector是一个活跃的开源社区项目，我们欢迎各种形式的贡献：

- 🐛 报告问题: [AgentDNS](https://github.com/jsjfai/AgentDNS/issues), [AgentDNS-Node](https://github.com/jsjfai/AgentDNS-Node/issues), [AgentDNS-Client](https://github.com/jsjfai/AgentDNS-client/issues),[AgentDNS-CLI-Client](https://github.com/jsjfai/AgentDNS-CLI-client)
- 💡 提交功能建议: [AgentDNS](https://github.com/jsjfai/AgentDNS/issues), [AgentDNS-Node](https://github.com/jsjfai/AgentDNS-Node/issues), [AgentDNS-Client](https://github.com/jsjfai/AgentDNS-client/issues), [AgentDNS-CLI-Client](https://github.com/jsjfai/AgentDNS-CLI-client/issues),
- 🔧 提交功能建议: [AgentDNS](https://github.com/jsjfai/AgentDNS/pulls), [AgentDNS-Node](https://github.com/jsjfai/AgentDNS-Node/pulls), [AgentDNS-Client](https://github.com/jsjfai/AgentDNS-client/pulls), [AgentDNS-CLI-Client](https://github.com/jsjfai/AgentDNS-CLI-client/pulls)


## 🙏🏻 致谢

本项目的构建得益于这些优秀的开源库：
- [DeepChat](https://github.com/ThinkInAIXYZ/deepchat)
- [Vue](https://vuejs.org/)
- [Electron](https://www.electronjs.org/)
- [Electron-Vite](electron-vite.org)
- [Rolldown-Vite](https://github.com/vitejs/rolldown-vite)
- [oxlint](https://github.com/oxc-project/oxc)

## 📃 许可证

[LICENSE](./LICENSE)
