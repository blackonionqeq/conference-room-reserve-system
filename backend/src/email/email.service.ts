import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { createTransport, Transporter } from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: Transporter

  // @Inject(ConfigService)
  // private configService: ConfigService

  constructor(private configService: ConfigService) {
    // const get = (key: string) => this.configService.get(key)
    const get = configService.get.bind(configService)
    console.log(get('nodemailer_auth_user'))
    this.transporter = createTransport({
      host: get('nodemailer_host'),
      port: get('nodemailer_port'),
      secure: false,
      auth: {
        user: get('nodemailer_auth_user'),
        pass: get('nodemailer_auth_pass'),
      },
      // host: 'smtp.qq.com',
      // port: 587,
      // secure: false,
      // auth: {
      //   user: 'blackonionqaq@foxmail.com',
      //   pass: 'bfpzvcbfiyeibjdd',
      // },
    })
  }
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('nodemailer_auth_user'),
        // address: 'blackonionqaq@foxmail.com',
      },
      to,
      subject,
      html,
    })
  }
}
