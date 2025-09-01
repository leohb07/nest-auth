import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { randomBytes, scrypt as _scrypt, randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { SignUpRequestDto } from './dto/signup-request.dto';
import { SignInRequestDto } from './dto/signin-request.dto';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

const users: User[] = [];

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async signUp(body: SignUpRequestDto) {
    const existingUserWithSameEmail = users.find(
      (user) => user.email === body.email,
    );
    if (existingUserWithSameEmail) {
      throw new BadRequestException('Email in use');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(body.password, salt, 32)) as Buffer;
    const saltAndHash = `${salt}.${hash.toString('hex')}`;

    const user = {
      _id: randomUUID(),
      email: body.email,
      password: saltAndHash,
    };
    users.push(user);
  }

  public async signIn(body: SignInRequestDto) {
    const user = users.find((user) => {
      return user.email === body.email;
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload = { email: user.email, sub: user._id };
    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return accessToken;
  }
}
