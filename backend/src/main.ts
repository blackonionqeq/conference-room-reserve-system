import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { FormatResponseInterceptor } from './format-response.interceptor'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new FormatResponseInterceptor())
  app.enableCors()
  app.useStaticAssets('uploads', {
    prefix: '/uploads',
  })
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER))
  await app.listen(app.get(ConfigService).get('nest_server_port'))
}
bootstrap()
