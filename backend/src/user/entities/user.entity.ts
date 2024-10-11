import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  Entity,
} from 'typeorm'
import { Role } from './role.entity'
import { Expose } from 'class-transformer'

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Expose()
  @Column({
    length: 40,
    comment: '用户名',
  })
  username: string

  @Column({
    length: 40,
    comment: '密码',
  })
  password: string

  @Expose()
  @Column({
    name: 'nick_name',
    length: 40,
    comment: '昵称',
  })
  nickName: string

  @Expose()
  @Column({
    length: 60,
    comment: '邮箱',
  })
  email: string

  @Expose()
  @Column({
    length: 120,
    comment: '头像',
    nullable: true,
  })
  avatar: string

  @Expose()
  @Column({
    length: 20,
    comment: '手机号',
    nullable: true,
  })
  phoneNumber: string

  @Column({
    comment: '是否冻结',
    default: false,
  })
  isFrozen: boolean

  @Column({
    default: false,
    comment: '是管理员与否',
  })
  isAdmin: boolean

  @CreateDateColumn()
  createDate: Date

  @UpdateDateColumn()
  updateDate: Date

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[]
}
