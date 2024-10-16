import { Controller, Get, Inject, Query } from '@nestjs/common'
import { StatisticService } from './statistic.service'

@Controller('statistic')
export class StatisticController {
  @Inject(StatisticService)
  private statisticService: StatisticService

  @Get('count-reservations-of-user')
  async countReservationsOfUser(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return await this.statisticService.countReservationsOfUser(
      startTime,
      endTime,
    )
  }
  @Get('count-reservations-of-room')
  async countReservationsOfRoom(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
  ) {
    return await this.statisticService.countReservationsOfRoom(
      startTime,
      endTime,
    )
  }
}
