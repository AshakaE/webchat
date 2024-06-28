import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Relation,
  DeleteDateColumn,
} from 'typeorm'
import Chat from './chat.entity'
import User from './user.entity'

@Entity()
class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: number

  @Column('text')
  content!: string

  @Column('varchar')
  messageType!: string

  @Column('varchar', { default: null })
  fileName?: string

  @ManyToOne('Chat', 'chat', { lazy: true })
  chat!: Relation<Chat>

  @ManyToOne('User', 'user', { lazy: true })
  user!: Relation<User>

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date

  @DeleteDateColumn()
  deleted!: Date
}

export default Message
