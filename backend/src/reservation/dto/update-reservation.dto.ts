import { PartialType } from '@nestjs/mapped-types'
import { CreateReservationDto } from './create-reservation.dto'
// import { IsNotEmpty, IsNumber } from 'class-validator'

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
