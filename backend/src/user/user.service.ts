import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  // UnauthorizedException,
} from '@nestjs/common'
// import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { RedisService } from 'src/redis/redis.service'
import { md5 } from 'src/utils/cypto'
import { EmailService } from 'src/email/email.service'
import { Role } from './entities/role.entity'
import { Permission } from './entities/permission.entity'

@Injectable()
export class UserService {
  private logger = new Logger()

  @InjectRepository(User)
  private userRepository: Repository<User>
  @InjectRepository(Role)
  private roleRepository: Repository<Role>
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>

  @Inject(RedisService)
  private redisService: RedisService

  @Inject(EmailService)
  private emailService: EmailService

  async register(user: RegisterUserDto) {
    console.log(user)

    const captcha = await this.redisService.get(`captcha_${user.email}`)
    if (!captcha) {
      throw new BadRequestException('验证码已失效')
    }
    if (captcha !== user.captcha) {
      throw new BadRequestException('验证码错误')
    }
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    })
    if (foundUser) {
      throw new BadRequestException('同名用户已注册')
    }
    const newUser = new User()
    Object.entries(user).forEach(([key, val]) => {
      newUser[key] = val
    })
    newUser.password = md5(user.password)

    try {
      await this.userRepository.save(newUser)
      return '注册成功'
    } catch (e) {
      this.logger.error(e, UserService)
      return '注册失败'
    }
  }

  async generateAndSendMail(address: string) {
    const code = Math.random().toString().slice(2, 8)
    await this.redisService.set(`captcha_${address}`, code, 5 * 60)
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是${code}</p>`,
    })
    console.log(address, code)
    return '发送成功'
  }

  async initUserData() {
    const user1 = new User()
    user1.username = 'zhangsan'
    user1.password = md5('111111')
    user1.email = 'xxx@xx.com'
    user1.isAdmin = true
    user1.nickName = '张三'
    user1.phoneNumber = '13233323333'
    console.log(user1)

    const user2 = new User()
    user2.username = 'lisi'
    user2.password = md5('222222')
    user2.email = 'yy@yy.com'
    user2.nickName = '李四'

    const role1 = new Role()
    role1.name = '管理员'

    const role2 = new Role()
    role2.name = '普通用户'

    const permission1 = new Permission()
    permission1.code = 'ccc'
    permission1.description = '访问 ccc 接口'

    const permission2 = new Permission()
    permission2.code = 'ddd'
    permission2.description = '访问 ddd 接口'

    user1.roles = [role1]
    user2.roles = [role2]

    role1.permissions = [permission1, permission2]
    role2.permissions = [permission1]

    await this.permissionRepository.save([permission1, permission2])
    await this.roleRepository.save([role1, role2])
    await this.userRepository.save([user1, user2])
  }
}
