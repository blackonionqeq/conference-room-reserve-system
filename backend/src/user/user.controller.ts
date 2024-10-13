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
  Param,
  ParseIntPipe,
  DefaultValuePipe,
  UploadedFile,
  BadRequestException,
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
import { ForgetPasswordDto } from './dto/forget-password.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import * as path from 'node:path'
import { storage } from 'src/utils/storage-config'
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
    return await this.userService.generateAndSendMail(address, '注册验证码')
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
  @RequireLogin()
  @Get('userInfo')
  async userInfo(@Req() req: Request) {
    return await this.userService.findUserById(req.user.userId)
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

  @Get('freeze/:username')
  async freeze(@Param('username') username: string) {
    return await this.userService.freezeUser(username)
  }

  @Get('list')
  async list(
    @Query('pageNum', new DefaultValuePipe(1), ParseIntPipe) pageNum: number,
    @Query('pageSize', new DefaultValuePipe(2), ParseIntPipe) pageSize: number,
    @Query('username') username?: string,
    @Query('email') email?: string,
    @Query('nickName') nickName?: string,
  ) {
    return await this.userService.findUsers({
      pageNum,
      pageSize,
      email,
      nickName,
      username,
    })
  }

  @Get('captcha/:email')
  async sendCaptchaEmail(@Param('email') email: string) {
    return await this.userService.generateAndSendMail(email)
  }

  @Post('forget-password')
  async forgetPassowrd(@Body() forgetpasswordDto: ForgetPasswordDto) {
    return await this.userService.forgetPassword(forgetpasswordDto)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      limits: {
        fileSize: 2 ** 20 * 3,
      },
      storage,
      fileFilter(req, file, callback) {
        const extname = path.extname(file.originalname)
        if (['.png', '.jpg', '.gif'].includes(extname)) {
          callback(null, true)
        } else {
          callback(new BadRequestException('只能上传图片'), false)
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file)
    return file.path
  }
}
