import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SettingsService {
  constructor(
      @InjectRepository(User)
      private userRes: Repository<User>,
  ) {}

  async toggle2FA(userId: string, enable: boolean): Promise<boolean> {
    await this.userRes.update(userId, {
      twoFactorEnabled: enable
    });

    return enable;
  }
}
