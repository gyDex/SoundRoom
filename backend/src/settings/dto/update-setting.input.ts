import { CreateSettingInput } from './create-setting.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSettingInput extends PartialType(CreateSettingInput) {
  id: number;
}
