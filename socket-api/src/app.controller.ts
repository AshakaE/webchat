import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common'
import { AppService } from './app.service'
import { Response } from 'express'
import UsersService from './App/Users/users.service'

@Controller()
export class AppController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async signUp(@Body('id') id: string) {
    return this.usersService.createUser(id)
  }

  @Post('/signin')
  async signIn(@Body('id') id: string, @Res() res: Response) {
    const u = await this.usersService.getUser(id)
    return res.status(u ? HttpStatus.OK : HttpStatus.NOT_FOUND).json({
      status: u ? HttpStatus.OK : HttpStatus.NOT_FOUND,
      data: u,
    })
  }
}
