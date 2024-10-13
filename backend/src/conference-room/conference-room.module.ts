import { Module } from '@nestjs/common'
import { ConferenceRoomService } from './conference-room.service'
import { ConferenceRoomController } from './conference-room.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConferenceRoom } from './entities/conference-room.entity'

@Module({
  controllers: [ConferenceRoomController],
  providers: [ConferenceRoomService],
  imports: [TypeOrmModule.forFeature([ConferenceRoom])],
})
export class ConferenceRoomModule {}
