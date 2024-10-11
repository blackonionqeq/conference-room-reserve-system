import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { User } from './user/entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'

type PickUser = Pick<User, 'username' | 'roles'> & { userId: number }

declare module 'express' {
  interface Request {
    user: PickUser
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector

  @Inject(JwtService)
  private jwtService: JwtService

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest()

    const isRequireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler(),
    ])

    if (!isRequireLogin) return true

    const authorization = request.headers.authorization as string

    if (!authorization) {
      throw new UnauthorizedException('用户未登录')
    }

    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify<PickUser>(token)

      request.user = data
      console.log(request.user)
      return true
    } catch {
      throw new UnauthorizedException('token失效，请重新登陆')
    }
  }
}
