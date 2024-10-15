import { BadRequestException, Inject, Injectable } from '@nestjs/common'
// import { CreateReservationDto } from './dto/create-reservation.dto'
// import { UpdateReservationDto } from './dto/update-reservation.dto'
import { User } from 'src/user/entities/user.entity'
import { ConferenceRoom } from 'src/conference-room/entities/conference-room.entity'
import { Reservation } from './entities/reservation.entity'
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm'
import { Between, EntityManager, Like, Repository } from 'typeorm'
import type { FindManyOptions } from 'typeorm'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'

@Injectable()
export class ReservationService {
  @InjectEntityManager()
  private entityManager: EntityManager

  @Inject()
  private emailService: EmailService
  @Inject()
  private redisService: RedisService

  @InjectRepository(Reservation)
  private reservationRepository: Repository<Reservation>

  async initData() {
    const user1 = await this.entityManager.findOneBy(User, {
      id: 1,
    })
    const user2 = await this.entityManager.findOneBy(User, {
      id: 2,
    })

    const room1 = await this.entityManager.findOneBy(ConferenceRoom, {
      id: 3,
    })
    const room2 = await await this.entityManager.findOneBy(ConferenceRoom, {
      id: 1,
    })

    const booking1 = new Reservation()
    booking1.room = room1
    booking1.user = user1
    booking1.startTime = new Date()
    booking1.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Reservation, booking1)

    const booking2 = new Reservation()
    booking2.room = room2
    booking2.user = user2
    booking2.startTime = new Date()
    booking2.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Reservation, booking2)

    const booking3 = new Reservation()
    booking3.room = room1
    booking3.user = user2
    booking3.startTime = new Date()
    booking3.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Reservation, booking3)

    const booking4 = new Reservation()
    booking4.room = room2
    booking4.user = user1
    booking4.startTime = new Date()
    booking4.endTime = new Date(Date.now() + 1000 * 60 * 60)

    await this.entityManager.save(Reservation, booking4)
  }

  async list({
    pageNum,
    pageSize,
    username,
    roomName,
    roomLocation,
    reserveStartFrom,
    reserveEndUntil,
  }: {
    pageNum: number
    pageSize: number
    username?: string
    roomName?: string
    roomLocation?: string
    reserveStartFrom?: number
    reserveEndUntil?: number
  }) {
    const skipCount = Math.max(0, pageNum - 1) * pageSize

    const where: FindManyOptions<Reservation>['where'] = {}
    if (username) {
      where.user = {
        username: Like(`%${username}%`),
      }
    }
    if (roomName || roomLocation) {
      where.room = {}
      if (roomName) where.room.name = Like(`%${roomName}%`)
      if (roomLocation) where.room.location = Like(`%${roomLocation}%`)
    }
    if (reserveStartFrom) {
      if (!reserveEndUntil) reserveEndUntil = reserveStartFrom + 3600 * 1000
      where.startTime = Between(
        new Date(reserveStartFrom),
        new Date(reserveEndUntil),
      )
    }

    const [reservations, totalCount] =
      await this.reservationRepository.findAndCount({
        select: {
          id: true,
          startTime: true,
          endTime: true,
          user: { id: true, username: true },
          status: true,
          note: true,
          createTime: true,
        },
        where,
        relations: { user: true, room: true },
        skip: skipCount,
        take: pageSize,
      })

    return {
      reservations,
      totalCount,
    }
  }

  async create(createDto: CreateReservationDto, userId: number) {
    console.log(createDto, userId)
    const targetRoom = await this.entityManager.findOneBy(ConferenceRoom, {
      id: createDto.roomId,
    })
    if (!targetRoom) {
      throw new BadRequestException('会议室不存在')
    }
    const startTime = new Date(createDto.startTime)
    const endTime = new Date(createDto.endTime)

    let exist = await this.reservationRepository.findOneBy({
      room: targetRoom,
      startTime: Between(startTime, endTime),
    })
    if (exist) {
      throw new BadRequestException('该会议室在当前时间段已被占用')
    } else {
      exist = await this.reservationRepository.findOneBy({
        room: targetRoom,
        endTime: Between(startTime, endTime),
      })
      if (exist) throw new BadRequestException('该会议室在当前时间段已被占用')
    }

    const user = await this.entityManager.findOneBy(User, { id: userId })
    const reservation = new Reservation()
    reservation.room = targetRoom
    reservation.user = user
    reservation.startTime = startTime
    reservation.endTime = endTime
    if (createDto.note) reservation.note = createDto.note

    await this.reservationRepository.save(reservation)
    return null
  }

  async changeStateById(id: number, type: string) {
    const targetReservation = await this.reservationRepository.findOneBy({
      id,
    })
    if (!id) {
      throw new BadRequestException('找不到此预订记录')
    }
    targetReservation.status = type
    await this.reservationRepository.save(targetReservation)
    return null
  }

  async urge(username: string) {
    const flag = await this.redisService.get(`urge_by_${username}`)
    if (flag) {
      throw new BadRequestException('一小时内只能催办一次，请耐心等待')
    }
    const targetUser = await this.entityManager.findOneBy(User, {
      isAdmin: true,
    })

    await this.emailService.sendMail({
      to: targetUser.email,
      subject: '预定申请催办提醒',
      html: `用户${username}的预定申请正在等待您的审批`,
    })
    this.redisService.set(`urge_by_${username}`, 1, 3600)
    return null
  }
}
