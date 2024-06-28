import {
  Column,
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
import User from './user.entity'

@Entity()
class Chat {
  @PrimaryColumn()
  id!: string

  @ManyToMany(() => User, user => user.chats, { lazy: true })
  users!: Relation<User>[]

  @OneToMany(() => Message, message => message.chat, { lazy: true })
  messages!: Relation<Message>[]

  @Column('boolean', { default: false })
  isGroup!: boolean

  @Column('json', { default: [] })
  admins: User[]

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date

  @DeleteDateColumn()
  deleted!: Date
}

export default Chat
