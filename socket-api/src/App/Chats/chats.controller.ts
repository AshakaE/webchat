import { Controller, Post, Body, Get, Param } from '@nestjs/common'
import ChatsService from './chats.service'


@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get(':id')
  async showChats(@Param('id') params: string) {
    return this.chatsService.getChatMesages(params)
  }
}
