import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { SettingsService } from './settings.service';
import { toggle2FAInput } from './dto/toggle-2FA.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver('Setting')
export class SettingsResolver {
  constructor(private readonly settingsService: SettingsService) {}

  @Mutation(() => Boolean, { name: 'toggle2FA' })
  @UseGuards(JwtAuthGuard)  
  update(
    @Args('toggle2FAInput') toggle2FAInput: toggle2FAInput,  
    @Context() ctx: any
  ) {
    const userId = ctx.req.user.userId;
    return this.settingsService.toggle2FA(userId, toggle2FAInput.enable);
  }
}
