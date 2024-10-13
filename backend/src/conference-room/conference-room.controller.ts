import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import { ConferenceRoomService } from './conference-room.service'
import { CreateConferenceRoomDto } from './dto/create-conference-room.dto'
import { UpdateConferenceRoomDto } from './dto/update-conference-room.dto'

@Controller('conference-room')
export class ConferenceRoomController {
  constructor(private readonly conferenceRoomService: ConferenceRoomService) {}

  @Get('list')
  async list(
    @Query('pageNum', new DefaultValuePipe(1), ParseIntPipe) pageNum: number,
    @Query('pageSize', new DefaultValuePipe(2), ParseIntPipe) pageSize: number,
    @Query('name') name?: string,
    @Query('capacity') capacity?: number,
    @Query('equipment') equipment?: string,
  ) {
    return await this.conferenceRoomService.list({
      pageNum,
      pageSize,
      name,
      capacity,
      equipment,
    })
  }

  @Post('create')
  async create(@Body() createConferenceRoomDto: CreateConferenceRoomDto) {
    return await this.conferenceRoomService.create(createConferenceRoomDto)
  }

  @Post('update')
  async update(@Body() updateConferenceRoomDto: UpdateConferenceRoomDto) {
    return await this.conferenceRoomService.update(updateConferenceRoomDto)
  }

  @Get(':id')
  async find(@Param('id') id: number) {
    return await this.conferenceRoomService.findOneById(id)
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: number) {
    return await this.conferenceRoomService.deleteOne(id)
  }
}
