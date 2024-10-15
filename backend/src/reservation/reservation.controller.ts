import {
  Controller,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  // Param,
  // Delete,
} from '@nestjs/common'
import { ReservationService } from './reservation.service'
import { RequireLogin } from 'src/utils/permission-decorator'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { Request } from 'express'
// import { CreateReservationDto } from './dto/create-reservation.dto';
// import { UpdateReservationDto } from './dto/update-reservation.dto';

@RequireLogin()
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get('admin/list')
  async adminList(
    @Query('pageNum', new DefaultValuePipe(1), ParseIntPipe) pageNum: number,
    @Query('pageSize', new DefaultValuePipe(2), ParseIntPipe) pageSize: number,
    @Query('username') username: string,
    @Query('roomName') roomName: string,
    @Query('roomLocation') roomLocation: string,
    @Query('reserveStartFrom') reserveStartFrom: number,
    @Query('reserveEndUntil') reserveEndUntil: number,
  ) {
    return await this.reservationService.list({
      pageNum,
      pageSize,
      username,
      roomLocation,
      roomName,
      reserveEndUntil,
      reserveStartFrom,
    })
  }

  // 跟上面的区别是，上面是管理员搜索用的，可以看所有角色
  // 这个是给普通角色用的，只能搜自己的
  @Get('list')
  async list(
    @Query('pageNum', new DefaultValuePipe(1), ParseIntPipe) pageNum: number,
    @Query('pageSize', new DefaultValuePipe(2), ParseIntPipe) pageSize: number,
    @Query('roomName') roomName: string,
    @Query('roomLocation') roomLocation: string,
    @Query('reserveStartFrom') reserveStartFrom: number,
    @Query('reserveEndUntil') reserveEndUntil: number,
    @Req() req: Request,
  ) {
    const username = req.user.username
    return await this.reservationService.list({
      pageNum,
      pageSize,
      username,
      roomLocation,
      roomName,
      reserveEndUntil,
      reserveStartFrom,
    })
  }

  @Post('add')
  async add(@Body() createDto: CreateReservationDto, @Req() req: Request) {
    return await this.reservationService.create(createDto, req.user.userId)
  }

  @Patch('confirm/:id')
  async confirm(@Param('id', ParseIntPipe) id: number) {
    return await this.reservationService.changeStateById(id, '1')
  }

  @Patch('reject/:id')
  async reject(@Param('id', ParseIntPipe) id: number) {
    return await this.reservationService.changeStateById(id, '2')
  }

  @Patch('unbind/:id')
  async unbind(@Param('id', ParseIntPipe) id: number) {
    return await this.reservationService.changeStateById(id, '3')
  }

  @Get('urge')
  async urge(@Req() req: Request) {
    return await this.reservationService.urge(req.user.username)
  }
}
