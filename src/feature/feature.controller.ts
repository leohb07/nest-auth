import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('feature')
export class FeatureController {
  @Get('public')
  public getPublicFeature() {
    return 'This is a public feature';
  }

  @UseGuards(JwtAuthGuard)
  @Get('private')
  public getPrivateFeature(@Request() req: { user: JwtPayload }) {
    return `Hello, ${req.user.email}! Your ID is ${req.user.sub}.`;
  }
}
