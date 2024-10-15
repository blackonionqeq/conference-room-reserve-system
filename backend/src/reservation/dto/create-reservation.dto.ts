import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateReservationDto {
  @IsNotEmpty()
  @IsNumber()
  roomId: number

  @IsNotEmpty({ message: '开始时间不能为空' })
  startTime: string

  @IsNotEmpty({ message: '结束时间不能为空' })
  endTime: string

  note: string
}
