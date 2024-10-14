import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConferenceRoom } from './entities/conference-room.entity'
import { Like, Repository } from 'typeorm'
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto'
import { UpdateConferenceRoomDto } from './dto/update-conference-room.dto'

@Injectable()
export class ConferenceRoomService {
  @InjectRepository(ConferenceRoom)
  private conferenceRoom: Repository<ConferenceRoom>

  initData() {
    const room1 = new ConferenceRoom()
    room1.name = '北京'
    room1.capacity = 100
    room1.equipment = '电脑'
    room1.location = '一层西'

    const room2 = new ConferenceRoom()
    room2.name = '上海'
    room2.capacity = 80
    room2.equipment = '很多电脑'
    room2.location = '二层东'

    const room3 = new ConferenceRoom()
    room3.name = '广州'
    room3.capacity = 60
    room3.equipment = '白板，电视'
    room3.location = '三层东'

    this.conferenceRoom.save([room1, room2, room3])
  }

  async list({
    pageNum,
    pageSize,
    name,
    capacity,
    equipment,
    location,
  }: {
    pageSize: number
    pageNum: number
    capacity?: number
    equipment?: string
    name?: string
    location?: string
  }) {
    const skipCount = Math.max(0, pageNum - 1) * pageSize

    const condition: Record<string, any> = {}
    if (name) condition.name = Like(`%${name}%`)
    if (capacity) condition.capacity = capacity
    if (equipment) condition.equipment = Like(`%${equipment}%`)
    if (location) condition.location = Like(`%${location}%`)
    const [conferenceRooms, totalCount] =
      await this.conferenceRoom.findAndCount({
        select: [
          'name',
          'id',
          'equipment',
          'description',
          'location',
          'capacity',
        ],
        skip: skipCount,
        take: pageSize,
        where: condition,
      })
    return {
      conferenceRooms,
      totalCount,
    }
  }

  async create(conferenceRoomDto: CreateConferenceRoomDto) {
    return await this.conferenceRoom.insert(conferenceRoomDto)
  }
  async update(conferenceRoomDto: UpdateConferenceRoomDto) {
    const target = await this.conferenceRoom.findOneBy({
      id: conferenceRoomDto.id,
    })
    if (!target) {
      throw new BadRequestException('会议室不存在')
    }
    Object.entries(conferenceRoomDto).forEach(([key, val]) => {
      if (key in target && val) target[key] = val
    })
    await this.conferenceRoom.update(
      {
        id: target.id,
      },
      target,
    )
    return null
  }
  async findOneById(id: number) {
    return await this.conferenceRoom.findOneBy({ id })
  }
  async deleteOne(id: number) {
    await this.conferenceRoom.delete(id)
    return null
  }
}
