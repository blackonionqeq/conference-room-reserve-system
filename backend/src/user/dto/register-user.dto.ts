import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string

  avatar: string

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(8, { message: '密码长度不能小于八位' })
  password: string

  nickname: string

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail({}, { message: '不是合法的邮箱格式' })
  email: string

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string
}
