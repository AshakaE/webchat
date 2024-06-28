import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import e from 'express'
import Chat from 'src/Database/Entities/chat.entity'
import Message from 'src/Database/Entities/message.entity'
import User from 'src/Database/Entities/user.entity'
import { In, Repository } from 'typeorm'

@Injectable()
class ChatsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createChat(
    id: string,
    primaryUser: string,
    users: string[],
    isGroup: boolean,
  ): Promise<Chat> {
    const host = await this.usersRepository.findOneBy({ id: primaryUser })
    const participants = await this.usersRepository.find({
      where: {
        id: In(users),
      },
    })
    const chat = new Chat()
    if (isGroup) {
      chat.admins = [host]
    }
    chat.id = id
    chat.users = [host, ...participants]

    return this.chatsRepository.save(chat)
  }

  async addMessageToChat(
    chatId: string,
    userId: string,
    content: string,
    messageType: string,
    fileName?: string,
  ): Promise<Message> {
    const chat = await this.chatsRepository.findOneBy({ id: chatId })
    const user = await this.usersRepository.findOneBy({ id: userId })
    if (!chat || !user) {
      throw new Error('Chat or User not found')
    }

    const message = new Message()
    if (fileName) {
      message.fileName = fileName
    }
    message.content = content
    message.messageType = messageType
    message.chat = chat
    message.user = user

    return this.messagesRepository.save(message)
  }

  async getChat(chatId: string) {
    const chatWithMessages = await this.chatsRepository.findOne({
      where: { id: chatId },
      select: ['id'],
    })

    return chatWithMessages
  }

  async getChatMesages(chatId: string) {
    const chatWithMessages = await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.user', 'user')
      .where('message.chat.id = :chatId', { chatId })
      .select([
        'message.chatId as "chatId"',
        'message.content as content',
        'message.created as created',
        'message.messageType as "messageType"',
        'message.fileName as "fileName"',
        'user.id AS user',
      ])
      .orderBy('message.created', 'ASC')
      .getRawMany()


    return chatWithMessages
  }
}

export default ChatsService
