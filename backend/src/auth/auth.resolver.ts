
  import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
  import { AuthService } from './auth.service';
  import { UseGuards } from '@nestjs/common';
  import { TokenResponse } from './dto/token.response';
  import { LoginInput } from './dto/login.input';
  import { RefreshAuthGuard } from './guards/refresh-auth.guard';
  import { JwtAuthGuard } from './guards/jwt-auth.guard';
  import { RegisterInput } from './dto/register.input';
import { User } from './entities/user.entity';
import { LogoutResponse } from './dto/logout.response';
import { GoogleLoginInput } from './dto/google-login-input';
import { TwoFactorSetupResponse } from './dto/two-factor-setup.response';
import { LoginResponse } from './dto/login.response';


  @Resolver()
  export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => TwoFactorSetupResponse)
    @UseGuards(JwtAuthGuard)
    enableTwoFactor(@Context() context: any) {
      const userId = context.req.user.userId;
      return this.authService.enableTwoFactor(userId);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    verifyTwoFactor(
      @Context() context: any,
      @Args('code') code: string,
    ) {
      const userId = context.req.user.userId;
      return this.authService.verifyTwoFactor(userId, code);
    }

    @Mutation(() => Boolean)
    @UseGuards(JwtAuthGuard)
    disableTwoFactor(
      @Context() context: any,
      @Args('code') code: string,
    ) {
      const userId = context.req.user.userId;
      return this.authService.disableTwoFactor(userId, code);
    }

    @Query(() => User)
    @UseGuards(JwtAuthGuard)
    async getMe(@Context() context: any): Promise<User | null> {
      const userId = context.req.user.userId;
      return this.authService.findById(userId);
    }

    @Mutation(() => TokenResponse)
    async register(
      @Args('registerInput') registerInput: RegisterInput, 
      @Context() context: any,
    ): Promise<TokenResponse> {
      const res = context.res;
      return this.authService.register(registerInput, res);
    }

    @Mutation(() => TokenResponse)
    async googleLogin(
      @Args('googleLoginInput') googleLoginInput: GoogleLoginInput,
      @Context() context: any,
    ): Promise<TokenResponse> {
      const res = context.res;
      return this.authService.googleLogin(googleLoginInput.token, res);
    }

    @Mutation(() => TokenResponse)
    loginWithTwoFactor(
      @Args('code') code: string,
      @Args('twoFaToken') twoFaToken: string,
      @Context() { res }: any,
    ) {
      return this.authService.loginWithTwoFactor(twoFaToken, code, res);
    }


    @Mutation(() => LoginResponse)
    login(
      @Args('loginInput') loginInput: LoginInput,
      @Context() context: any,
    ) {
      return this.authService.login(loginInput, context.res);
    }

    @Mutation(() => Boolean)
    @UseGuards(RefreshAuthGuard)
    async refreshToken(@Context() { req, res }: any) {
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(req.user.userId);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return true;
    }

    @Mutation(() => LogoutResponse)
    @UseGuards(JwtAuthGuard)
    async logout(@Context() context: any): Promise<LogoutResponse> {
      const userId = context.req.user.userId;
      const res = context.res;
      return this.authService.logout(res, userId);
    }
  }