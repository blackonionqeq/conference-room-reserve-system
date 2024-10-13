import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({
  name: 'conference_rooms',
})
export class ConferenceRoom {
  @PrimaryGeneratedColumn({ comment: '会议室id' })
  id: number

  @Column({ length: 30, comment: '会议室名字' })
  name: string

  @Column({ comment: '会议室容量' })
  capacity: number

  @Column({ comment: '位置', length: 50 })
  location: string

  @Column({ comment: '设备', length: 50, default: '' })
  equipment: string

  @Column({ comment: '描述', length: 100, default: '' })
  description: string

  @Column({ comment: '是否已被预订', default: false })
  isReserved: boolean

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date
}
