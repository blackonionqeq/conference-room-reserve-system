import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateConferenceRoomDto {
  @IsNotEmpty({ message: '会议室名字不能为空' })
  @MaxLength(30, { message: '会议室名字不能超过20个字符' })
  name: string

  @IsNotEmpty({ message: '容量不能为空' })
  capacity: number

  @IsNotEmpty({ message: '位置不能为空' })
  @MaxLength(50, { message: '位置不能超过50个字符' })
  location: string

  @IsNotEmpty({ message: '设备不能为空' })
  @MaxLength(50, { message: '设备不能超过50个字符' })
  equipment: string

  @IsNotEmpty({ message: '描述不能为空' })
  @MaxLength(100, { message: '描述不能超过50个字符' })
  description: string
}
