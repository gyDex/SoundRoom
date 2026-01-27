import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginInput } from './dto/login.input';
import { TokenResponse } from './dto/token.response';
import { RegisterInput } from './dto/register.input';
import { Response } from 'express';
import { LogoutResponse } from './dto/logout.response';
import { OAuth2Client } from 'google-auth-library';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { LoginResponse } from './dto/login.response';

export type SafeUser = Omit<User, 'password' | 'refreshToken'>;
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
  );

  
async enableTwoFactor(userId: string) {
  const user = await this.usersRepository.findOneBy({ id: userId });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const secret = speakeasy.generateSecret({
    length: 20,
    name: `SoundRoom (${user.email})`,
  });

  user.twoFactorSecret = secret.base32;
  await this.usersRepository.save(user);

  const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

  return {
    qrCode: secret.otpauth_url,
    secret: secret.base32,
  };
}

async verifyTwoFactor(userId: string, code: string) {
  const user = await this.usersRepository.findOneBy({ id: userId });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  const valid = speakeasy.totp.verify({
    secret: user.twoFactorSecret!,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!valid) {
    throw new ForbiddenException('Invalid 2FA code');
  }

  user.twoFactorEnabled = true;
  await this.usersRepository.save(user);

  return true;
}

async disableTwoFactor(userId: string, code: string) {
  const user = await this.usersRepository.findOneBy({ id: userId });

  const valid = speakeasy.totp.verify({
    secret: user?.twoFactorSecret!,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!valid) {
    throw new ForbiddenException('Invalid code');
  }

  if (!user) {
    throw new BadRequestException('User not found');
  }

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;
  await this.usersRepository.save(user);

  return true;
}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createUser(name: string, email: string, password: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const tag = await this.generateUniqueTag(name)
    
    const user = this.usersRepository.create({
      username: name,
      email,
      password: hashedPassword,
      tag: tag
    });

    return this.usersRepository.save(user);
  }

  async updateRefreshToken(userId: string, refreshToken: string | undefined): Promise<void> {
    await this.usersRepository.update(userId, { refreshToken });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email) as User;

    if (!user || user.provider !== 'local') {
      return null;
    }

    if (!user.password) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, refreshToken: __, ...safeUser } = user;
    return safeUser;
  }

  
  async login(
    loginInput: LoginInput,
    res: Response,
  ): Promise<LoginResponse> {
    const user = await this.usersRepository.findOne({
      where: { email: loginInput.email },
    });

    if (!user || user.provider !== 'local' || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(
      loginInput.password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    

    if (user.twoFactorEnabled) {
      const twoFaToken = this.jwtService.sign(
        { sub: user.id, type: '2fa' },
        { secret: process.env.JWT_2FA_SECRET, expiresIn: '5m' },
      );

      console.log(twoFaToken)

      return {
        success: false,
        twoFaToken: twoFaToken,
        twoFactorRequired: true,
      };
    }

    const { password, refreshToken, ...safeUser } = user;
    const tokens = await this.generateTokens(safeUser);

    await this.updateRefreshToken(user.id, tokens.refreshToken);
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      success: true,
      twoFactorRequired: false,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn,
      tokenType: 'Bearer',
    };
  }

  async loginWithTwoFactor(
    twoFaToken: string,
    code: string,
    res: Response,
  ): Promise<TokenResponse> {

    let payload: any

    try {
      payload = this.jwtService.verify(twoFaToken, {
        secret: process.env.JWT_2FA_SECRET,
      })
    } catch {
      throw new UnauthorizedException('Invalid or expired 2FA token')
    }

    if (payload.type !== '2fa') {
      throw new UnauthorizedException('Invalid token type')
    }

    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    })

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new UnauthorizedException()
    }

    const valid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    })

    if (!valid) {
      throw new ForbiddenException('Invalid 2FA code')
    }

    const { password, refreshToken, ...safeUser } = user
    const tokens = await this.generateTokens(safeUser)

    await this.updateRefreshToken(user.id, tokens.refreshToken)
    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken)

    return {
      ...tokens,
      tokenType: 'Bearer',
    }
  }

  async register(registerInput: RegisterInput, res: Response): Promise<TokenResponse> {
    const newUser = await this.createUser(registerInput.username ?? 'user', registerInput.email, registerInput.password);

    const { password: _, refreshToken: __, ...safeUser } = newUser;
    console.log(newUser.refreshToken, 'newUser')
    const tokens = await this.generateTokens(safeUser);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    
    return {
      ...tokens,
      tokenType: 'Bearer'
    };
  }

  async googleLogin(idToken: string, res: Response): Promise<TokenResponse> {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new BadRequestException('Invalid Google token');
    }

    let user = await this.findByEmail(payload.email);

    const tag = await this.generateUniqueTag(user?.username ?? 'user');

    console.log(payload)

    if (!user) {
      user = this.usersRepository.create({
        email: payload.email,
        username: payload.name,
        provider: 'google',
        tag: tag,
        password: '',
      });
      user = await this.usersRepository.save(user);
    }

    const { password: _, refreshToken: __, ...safeUser } = user;

    const tokens = await this.generateTokens(safeUser);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    return {
      ...tokens,
      tokenType: 'Bearer',
    };
  }

  async refreshTokens(userId: string) {
  const user = await this.usersRepository.findOne({ where: { id: userId } });
  if (!user) throw new UnauthorizedException();

  const payload = { email: user.email, sub: user.id };

  const accessToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: '15m',
  });

  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  });

  user.refreshToken = refreshToken;
  await this.usersRepository.save(user);

  return { accessToken, refreshToken };
}

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000, 
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
  }

  private async generateUniqueTag(username: string): Promise<string> {
    while (true) {
      const tag = Math.floor(1000 + Math.random() * 9000).toString();

      const exists = await this.usersRepository.findOne({
        where: { username, tag },
      });

      if (!exists) return tag;
    }
  }

  async logout(res: Response, userId: string): Promise<LogoutResponse> {
    await this.updateRefreshToken(userId, undefined);

    res.clearCookie('accessToken');

    res.clearCookie('refreshToken');

    return {
      success: true 
    };
  }

  private async generateTokens(user: SafeUser): Promise<Omit<TokenResponse, 'tokenType'>> {
    const payload = { 
      email: user.email, 
      sub: user.id 
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'fallback-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 минут в секундах
    };
  }
}