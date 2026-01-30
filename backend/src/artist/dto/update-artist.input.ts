import { CreateArtistInput } from './create-artist.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateArtistInput extends PartialType(CreateArtistInput) {
  id: number;
}
