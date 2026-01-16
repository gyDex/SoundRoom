import { User } from 'src/auth/entities/user.entity';
import { Track } from 'src/track/track.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['user', 'track'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Track, { onDelete: 'CASCADE' })
  track: Track;
}
