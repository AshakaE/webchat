import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import Chat from 'src/Database/Entities/chat.entity'
import Message from 'src/Database/Entities/message.entity'
import User from 'src/Database/Entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createMessage(
    chatId: string,
    userId: string,
    content: string,
    messageType: string,
  ): Promise<Message> {
    const chat = await this.chatRepository.findOneBy({ id: chatId })
    if (!chat) {
      throw new Error('Chat not found')
    }

    const user = await this.userRepository.findOneBy({ id: userId })
    if (!user) {
      throw new Error('User not found')
    }

    const message = new Message()
    message.chat = chat
    message.user = user
    message.content = content
    message.messageType = messageType

    return this.messageRepository.save(message)
  }
}
