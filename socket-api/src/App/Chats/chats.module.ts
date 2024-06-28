import { Module } from '@nestjs/common'
import { ChatsController } from './chats.controller'
import ChatsService from './chats.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import Chat from 'src/Database/Entities/chat.entity'
import User from 'src/Database/Entities/user.entity'
import Message from 'src/Database/Entities/message.entity'


@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Message])],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
