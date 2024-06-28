import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import User from 'src/Database/Entities/user.entity'
import { Not, Repository } from 'typeorm'

@Injectable()
class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(id: string): Promise<User | boolean | string> {
    const existsUser = await this.usersRepository
      .createQueryBuilder()
      .where('LOWER(id) = LOWER(:id)', { id })
      .getRawOne()

    if (!existsUser) {
      const user = this.usersRepository.create({
        id,
      })
      await this.usersRepository.save(user)
      console.log(user)
      return true
    }
  }

  async getUsers(
    page: number = 1,
    limit: number = 10,
    currentUserId: string,
  ): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: { id: Not(currentUserId) },
      skip: (page - 1) * limit,
      take: limit,
      order: { created: 'DESC' },
    })
    return users
  }

  async getUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id })
    return user
  }

  async getUserChats(userId: string) {
    const chatWithMessages = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['chats'],
    })
 
    return chatWithMessages['__chats__'] || []
  }
}

export default UsersService
