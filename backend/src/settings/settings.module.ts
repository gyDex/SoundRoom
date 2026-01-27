import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsResolver } from './settings.resolver';
import { User } from 'src/auth/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SettingsResolver, SettingsService],
  imports: [TypeOrmModule.forFeature([User])]
})
export class SettingsModule {}
