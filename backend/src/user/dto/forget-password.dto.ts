import { IsNotEmpty } from 'class-validator'

export class ForgetPasswordDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string

  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string

  @IsNotEmpty({ message: '新密码不能为空' })
  password: string

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string
}
