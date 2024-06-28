import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm'

import Message from './message.entity'
import Chat from './chat.entity'

@Entity()
class User {
  @PrimaryColumn('varchar', {
    length: 255,
  })
  id!: string

  @ManyToMany(() => Chat, chat => chat.users, { lazy: true })
  @JoinTable()
  chats!: Relation<Chat>[]

  @OneToMany(() => Message, message => message.user, { lazy: true })
  messages!: Relation<Message>[]

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date

  @DeleteDateColumn()
  deleted!: Date
}

export default User
