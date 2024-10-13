import { PartialType } from '@nestjs/mapped-types'
import { CreateConferenceRoomDto } from './create-conference-room.dto'
import { IsNotEmpty } from 'class-validator'

export class UpdateConferenceRoomDto extends PartialType(
  CreateConferenceRoomDto,
) {
  @IsNotEmpty({ message: 'id不能为空' })
  id: number
}
