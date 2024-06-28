// src/users/users.controller.ts
import { Controller, Post, Body, Get, Query, Req, Param } from '@nestjs/common'
import UsersService from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body('id') id: string) {
    return this.usersService.createUser(id)
  }

  @Get()
  async allUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('currentUserId') currentUserId: string,
  ) {
    return this.usersService.getUsers(page, limit, currentUserId)
  }

  @Get(':id/chats')
  async showUserChats(@Param('id') params: string) {
    return this.usersService.getUserChats(params)
  }
}
