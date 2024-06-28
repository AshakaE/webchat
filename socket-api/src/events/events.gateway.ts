import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import * as fs from 'fs-extra'
import { Server, Socket } from 'socket.io'
import * as path from 'path'
import ChatsService from 'src/App/Chats/chats.service'

interface FileMessage {
  name: string
  type: string
  data: ArrayBuffer
  user: string
  chatId: string
  recipient: string
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  constructor(private readonly chatsService: ChatsService) {}
  @WebSocketServer()
  server!: Server

  @SubscribeMessage('message')
  async handleChat(@MessageBody() data: any) {
    const chat = await this.chatsService.getChat(data.chatId)
    if (!chat) {
      const newChat = await this.chatsService.createChat(
        data.chatId,
        data.user,
        [data.recipient],
        false,
      )
      await this.chatsService.addMessageToChat(
        newChat.id,
        data.user,
        data.content,
        data.messageType,
      )
      this.server.emit('message', data)
    } else {
      console.log(data)
      await this.chatsService.addMessageToChat(
        chat.id,
        data.user,
        data.content,
        data.messageType,
      )
      this.server.emit('message', data)
    }
  }

  @SubscribeMessage('file')
  async handleChatFile(client: Socket, file: FileMessage): Promise<void> {
    const chat = await this.chatsService.getChat(file.chatId)
    const uploadDir = path.join(process.cwd(), 'uploads')
    await fs.ensureDir(uploadDir)

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(uploadDir, fileName)
    await fs.writeFile(filePath, Buffer.from(file.data))
    const fileUrl = `/uploads/${fileName}`
    if (!chat) {
      const newChat = await this.chatsService.createChat(
        chat.id,
        file.user,
        [file.recipient],
        false,
      )
      await this.chatsService.addMessageToChat(
        newChat.id,
        file.user,
        fileName,
        file.type,
      )
      this.server.emit('file', {
        ...file,
        url: fileUrl,
      })
    } else {
      await this.chatsService.addMessageToChat(
        chat.id,
        file.user,
        file.name,
        file.type,
        fileName,
      )
      this.server.emit('file', {
        ...file,
        url: fileUrl,
      })
    }
  }

  @SubscribeMessage('downloadFile')
  async handleDownloadFile(client: Socket, fileId: string): Promise<void> {
    console.log(fileId)
    const filePath = path.join(process.cwd(), 'uploads', fileId)
    if (await fs.pathExists(filePath)) {
      const fileData = await fs.readFile(filePath)
      const fileName = fileId.substring(fileId.indexOf('-') + 1)

      client.emit('fileData', {
        name: fileName,
        data: fileData,
      })
    } else {
      client.emit('fileError', 'File not found')
    }
  }
}
