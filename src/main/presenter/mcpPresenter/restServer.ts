import { ServerManager } from './serverManager'
import { IConfigPresenter } from '@shared/presenter'
import { parse } from 'url'
import { IncomingMessage, ServerResponse } from 'http'
import * as http from 'http'
import { eventBus, SendTarget } from '@/eventbus'
import { MCP_EVENTS } from '@/events'

export class RestServer {
  private server: http.Server
  private serverManager: ServerManager
  private configPresenter: IConfigPresenter
  private port: number = 5174

  constructor(configPresenter: IConfigPresenter, serverManager: ServerManager) {
    this.serverManager = serverManager
    this.configPresenter = configPresenter
    this.server = http.createServer(this.handleRequest.bind(this))
  }

  start(): void {
    this.server.listen(this.port, () => {
      console.log(`MCP REST API server running on http://localhost:${this.port}`)
    })
  }

  private async handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
    const { pathname } = parse(req.url || '', true)
    const mcp_servers_prefix = '/api/mcp/servers/'
    const server_location = 4
    const action_location = 5
    const mcp_server_path = '/api/mcp/server'
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

    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // 处理预检请求
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }

    // 解析服务器名称参数
    const serverName = pathname?.split('/')[server_location] || ''
    const action = pathname?.split('/')[action_location] || ''

    try {
      if (pathname == mcp_server_path) {
        // 解析请求体 JSON
        const body = await new Promise<any>((resolve, reject) => {
          let data = ''
          req.on('data', (chunk) => (data += chunk))
          req.on('end', () => {
            try {
              // 处理空请求体并添加JSON解析错误捕获
              resolve(data ? JSON.parse(data) : {})
            } catch (error) {
              if (error instanceof Error) {
                reject(new Error(`Invalid JSON: ${error.message}`))
              } else {
                reject(new Error(`Invalid JSON: ${String(error)}`)) // 处理非 Error 类型的错误
              }
            }
          })
          req.on('error', reject)
        })

        // POST /api/mcp/server -d {"name":"test", "baseUrl":"http://192.168.201.108:30003/mcp/$smart"}
        if (req.method === 'POST') {
          // 验证请求参数
          if (!body.name || !body.baseUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: false,
                message: 'Invalid body'
              })
            )
            return
          }
          config_template.baseUrl = body.baseUrl
          await this.configPresenter.addMcpServer(body.name, config_template)
          await this.serverManager.startServer(body.name)
          // 通知渲染进程服务器已启动
          eventBus.send(MCP_EVENTS.SERVER_STARTED, SendTarget.ALL_WINDOWS, body.name)

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              success: true,
              message: `MCP server ${body.name} added successfully`
            })
          )
          return
        } else if (req.method === 'DELETE') {
          // DELETE /api/mcp/server -d {"name":"test"}
          // 验证请求参数
          if (!body.name) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: false,
                message: 'Invalid body'
              })
            )
            return
          }
          this.configPresenter.removeMcpServer(body.name)
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              success: true,
              message: `MCP server ${body.name} removed successfully`
            })
          )
          return
        }
      }

      // 启动服务器 - POST /api/mcp/servers/:serverName/:action
      if (req.method === 'POST' && pathname?.startsWith(mcp_servers_prefix)) {
        if (action === 'start') {
          await this.serverManager.startServer(serverName)
          eventBus.send(MCP_EVENTS.SERVER_STARTED, SendTarget.ALL_WINDOWS, serverName)
        } else if (action === 'stop') {
          await this.serverManager.stopServer(serverName)
          eventBus.send(MCP_EVENTS.SERVER_STOPPED, SendTarget.ALL_WINDOWS, serverName)
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              success: false,
              message: 'Invalid action',
              server: serverName
            })
          )
          return
        }
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            success: true,
            message: `MCP server ${serverName} ${action} successfully`
          })
        )
        return
      }

      // 获取mcp server状态 - GET /api/mcp/servers/:serverName
      if (req.method === 'GET' && pathname?.startsWith(mcp_servers_prefix)) {
        const status = this.serverManager.isServerRunning(serverName)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            success: true,
            message: `MCP server ${serverName} is running: ${status}`
          })
        )
        return
      }

      // 未找到路由
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ success: false, message: 'Route not found' }))
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          server: serverName
        })
      )
    }
  }

  stop(): void {
    this.server.close()
  }
}
