import {
  Controller,
  // Get,
  Post,
  Body,
  Get,
  Query,
  // Inject,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
// import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser)
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    return await this.userService.generateAndSendMail(address)
  }

  @Get('init-user-data')
  async initUserData() {
    await this.userService.initUserData()
    return '搞定'
  }
}
