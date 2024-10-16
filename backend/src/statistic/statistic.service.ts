import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { ConferenceRoom } from 'src/conference-room/entities/conference-room.entity'
import { Reservation } from 'src/reservation/entities/reservation.entity'
import { User } from 'src/user/entities/user.entity'
import { EntityManager } from 'typeorm'

@Injectable()
export class StatisticService {
  @InjectEntityManager()
  private entityManager: EntityManager

  async countReservationsOfUser(
    startTime = '2024-10-04 16:27:06',
    endTime = '2024-10-18 16:27:06',
  ) {
    const res = await this.entityManager
      .createQueryBuilder(Reservation, 'r')
      .select('u.username', 'username')
      .leftJoin(User, 'u', 'r.userId = u.id')
      .addSelect('count(*)', 'reservationCount')
      .where('r.startTime between :startTime and :endTime', {
        startTime,
        endTime,
      })
      .addGroupBy('r.user')
      .getRawMany()
    return res
  }
  async countReservationsOfRoom(
    startTime = '2024-10-04 16:27:06',
    endTime = '2024-10-18 16:27:06',
  ) {
    const res = await this.entityManager
      .createQueryBuilder(Reservation, 'r')
      .select('room.name', 'roomName')
      .leftJoin(ConferenceRoom, 'room', 'r.roomId = room.id')
      .addSelect('count(*)', 'reservationCount')
      .where('r.startTime between :startTime and :endTime', {
        startTime,
        endTime,
      })
      .addGroupBy('room.id')
      .getRawMany()
    return res
  }
}
