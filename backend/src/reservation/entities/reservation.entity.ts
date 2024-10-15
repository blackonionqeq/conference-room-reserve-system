import { ConferenceRoom } from 'src/conference-room/entities/conference-room.entity'
import { User } from 'src/user/entities/user.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'reservations' })
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ comment: '开始时间' })
  startTime: Date

  @Column({ comment: '结束时间' })
  endTime: Date

  @Column({
    comment: '状态（申请中0、已审核1、驳回2、已解除3）',
    default: '0',
    length: 20,
  })
  status: string

  @Column({ comment: '备注', length: 150, default: '' })
  note: string

  @ManyToOne(() => User)
  user: User

  @ManyToOne(() => ConferenceRoom)
  room: ConferenceRoom

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date
}
