import express, { Express } from 'express'
import { Server } from 'http'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'
import { z } from 'zod'
import { ServerManager } from './serverManager'
import { IConfigPresenter } from '@shared/presenter'
import { eventBus, SendTarget } from '@/eventbus'
import { MCP_EVENTS } from '@/events'

export class SseServer {
  private readonly app: Express
  private server?: Server
  private transports = new Map<string, SSEServerTransport>()
  private readonly mcp: McpServer
  private readonly port: number
  private serverManager: ServerManager
  private configPresenter: IConfigPresenter
  private readonly mcp_server_name: string = 'mcp-harbor'

  constructor(
    configPresenter: IConfigPresenter,
    serverManager: ServerManager,
    options: { name?: string; version?: string; port?: number } = {}
  ) {
    this.serverManager = serverManager
    this.configPresenter = configPresenter
    this.port = 5175
    this.app = express()

    // 1. 创建 MCP Server
    this.mcp = new McpServer({
      name: options.name ?? this.mcp_server_name,
      version: options.version ?? '1.0.0'
    })

    // 2. 示例工具
    this.mcp.tool(
      'register_mcp_server',
      {
        name: z.string().describe('给新 MCP 服务器起的唯一名称'),
        baseUrl: z
          .string()
          .url()
          .describe('新 MCP 服务器的完整 base URL，如 http://192.168.201.108:30003/mcp/$smart')
      },
      async ({ name, baseUrl }) => {
        const config_template: {
          descriptions: string
          icons: string
          autoApprove: string[]
          type: 'http' | 'sse' | 'stdio' | 'inmemory' // 改为具体的联合类型
          command: string
          args: never[]
          env: {}
          baseUrl: string
          customHeaders: {}
          customNpmRegistry: string
        } = {
          descriptions: 'Internal usage only',
          icons: '',
          autoApprove: ['all'],
          type: 'http',
          command: '',
          args: [],
          env: {},
          baseUrl: '',
          customHeaders: {},
          customNpmRegistry: ''
        }

        if (name === this.mcp_server_name) {
          throw new Error('Cannot register internal SSE server')
        }

        try {
          config_template.baseUrl = baseUrl
          await this.configPresenter.addMcpServer(name, config_template)
          await this.serverManager.startServer(name)
          // 通知渲染进程服务器已启动
          eventBus.send(MCP_EVENTS.SERVER_STARTED, SendTarget.ALL_WINDOWS, name)

          // 如果一切都成功：
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  message: `MCP server ${name} added successfully`
                })
              }
            ]
          }
        } catch (error) {
          // 任何异常统一返回
          let message = 'Unknown error'
          if (error instanceof Error) {
            message = error.message
          } else {
            message = String(error)
          }
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  message: message
                })
              }
            ]
          }
        }
      }
    )

    this.mcp.tool(
      'remove_mcp_server',
      {
        name: z.string().describe('要移除的 MCP 服务器名称')
      },
      async ({ name }) => {
        if (name === this.mcp_server_name) {
          throw new Error('Cannot remove internal SSE server')
        }
        await this.serverManager.stopServer(name)
        eventBus.send(MCP_EVENTS.SERVER_STOPPED, SendTarget.ALL_WINDOWS, name)
        try {
          this.configPresenter.removeMcpServer(name)
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: true,
                  message: `MCP server ${name} removed successfully`
                })
              }
            ]
          }
        } catch (error) {
          // 任何异常统一返回
          let message = 'Unknown error'
          if (error instanceof Error) {
            message = error.message
          } else {
            message = String(error)
          }
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  message: message
                })
              }
            ]
          }
        }
      }
    )

    this.setupRoutes()
  }

  private setupRoutes(): void {
    // SSE 端点
    this.app.get('/sse', async (_, res) => {
      const transport = new SSEServerTransport('/messages', res)
      this.transports.set(transport.sessionId, transport)
      res.once('close', () => this.transports.delete(transport.sessionId))
      await this.mcp.connect(transport)
    })

    // 消息端点
    this.app.post('/messages', async (req, res) => {
      const sessionId = req.query.sessionId as string
      const transport = this.transports.get(sessionId)
      if (!transport) return res.status(400).send('unknown session')
      await transport.handlePostMessage(req, res)
    })
  }

  async startServer(port = this.port): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(port, () => {
        console.log(`MCP SSE server listening on http://localhost:${port}/sse`)
        resolve()
      })
    })
  }

  async start(): Promise<void> {
    await this.startServer()
    const config_template: {
      descriptions: string
      icons: string
      autoApprove: string[]
      type: 'http' | 'sse' | 'stdio' | 'inmemory' // 改为具体的联合类型
      command: string
      args: never[]
      env: {}
      baseUrl: string
      customHeaders: {}
      customNpmRegistry: string
    } = {
      descriptions: 'Internal usage only',
      icons: '',
      autoApprove: ['all'],
      type: 'sse',
      command: '',
      args: [],
      env: {},
      baseUrl: '',
      customHeaders: {},
      customNpmRegistry: ''
    }
    config_template.baseUrl = `http://localhost:${this.port}/sse`
    await this.configPresenter.addMcpServer(this.mcp_server_name, config_template)
    await this.serverManager.startServer(this.mcp_server_name)
    // 通知渲染进程服务器已启动
    eventBus.send(MCP_EVENTS.SERVER_STARTED, SendTarget.ALL_WINDOWS, this.mcp_server_name)
  }
  async stopServer(): Promise<void> {
    await this.serverManager.stopServer(this.mcp_server_name)
    eventBus.send(MCP_EVENTS.SERVER_STOPPED, SendTarget.ALL_WINDOWS, this.mcp_server_name)
    await this.configPresenter.removeMcpServer(this.mcp_server_name)
    // 先关闭所有 transport
    await Promise.all(Array.from(this.transports.values()).map((t) => t.close()))
    this.transports.clear()

    return new Promise<void>((resolve, reject) => {
      if (!this.server) return resolve()
      this.server.close((err) => (err ? reject(err) : resolve()))
    })
  }
}
