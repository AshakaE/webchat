import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import User from './Entities/user.entity'
import Message from './Entities/message.entity'
import Chat from './Entities/chat.entity'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        port: 5432,
        host: configService.get('DATABASE_HOST'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASS'),
        database: configService.get('DATABASE_NAME'),
        entities: [Message, Chat, User],
        synchronize: true,
        keepConnectionAlive: true,
        logging: ['error'],
      }),
      inject: [ConfigService],
    }),
  ],
})
class DatabaseModule {}

export default DatabaseModule
