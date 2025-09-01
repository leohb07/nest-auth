import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { SignInRequestDto } from './dto/signin-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(204)
  public async signUp(@Body() body: SignUpRequestDto) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  public async signIn(@Body() body: SignInRequestDto) {
    return await this.authService.signIn(body);
  }
}
