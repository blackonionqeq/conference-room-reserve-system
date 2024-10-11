import {
  Controller,
  // Get,
  Post,
  Body,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Req,
  // SetMetadata,
  // Inject,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common'
import { UserService } from './user.service'
// import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { RequireLogin, RequirePermission } from 'src/utils/permission-decorator'
import { UpdatePasswordDto } from './dto/update-password.dto'
import type { Request } from 'express'
import { UpdateUserDto } from './dto/update-user.dto'
// import { md5 } from 'src/utils/cypto'

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

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser, false)
    return user
  }
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser, true)
    return user
  }
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    return this.userService.refreshToken(refreshToken)
  }

  @SerializeOptions({
    strategy: 'excludeAll',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('userInfo')
  async userInfo(@Query('id') userId: string) {
    return await this.userService.findUserById(userId)
  }

  @Get('aaa')
  @RequireLogin()
  @RequirePermission('ddd')
  aaa() {
    return 'get aaa!'
  }

  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @Body() passwordDto: UpdatePasswordDto,
    @Req() req: Request,
  ) {
    return await this.userService.updatePassword(passwordDto, req.user.userId)
  }

  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return await this.userService.updateUserInfo(updateUserDto, req.user.userId)
  }
}
