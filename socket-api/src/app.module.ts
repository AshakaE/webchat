import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { EventsModule } from './events/events.module'
import { ChatsModule } from './App/Chats/chats.module'
import { UsersModule } from './App/Users/users.module'
import DatabaseModule from './Database/database.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventsModule,
    DatabaseModule,
    ChatsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
