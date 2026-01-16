import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackInput } from './dto/create-track.input';
import { UpdateTrackInput } from './dto/update-track.input';
import { Favorite } from 'src/favorite/entities/favorite.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,

    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
  ) {}

  async create(createTrackInput: CreateTrackInput): Promise<Track> {
      const track = this.trackRepository.create(createTrackInput);
      return await this.trackRepository.save(track);
  }

  async findAll(): Promise<Track[]> {
    return await this.trackRepository.find();
  }

  async findOne(id: any): Promise<any> {
    return await this.trackRepository.findOne({ 
      where: { id } 
    });
  }

  async findByIds(ids: string[]): Promise<Track[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    return this.trackRepository.find({
      where: {
        id: In(ids)
      }
    });
  }

  async checkFavorite(userId: string, trackId: string) {
    const exists = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        track: { id: trackId },
      },
    });

    if (exists) return true

    return false;
  }

  async getFavorite(userId: string) {
    const exists = await this.favoriteRepository.find({
      where: {
        user: {
          id: userId
        }
      },

      relations: {
        track: true
      }
    }).then(favs => favs.map(f => f.track).filter(Boolean))

    return exists;
  }

  async addFavorite(userId: string, trackId: string) {
    const exists = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        track: { id: trackId },
      },
    });

    if (exists && exists !== null) {
      await this.favoriteRepository.delete(exists.id);
      return false;
    }

    this.favoriteRepository.create({
      user: { id: userId },
      track: { id: trackId },
    });

await this.favoriteRepository
  .createQueryBuilder()
  .insert()
  .into(Favorite)
  .values({
    user: { id: userId },
    track: { id: trackId },
  })
  .orIgnore()
  .execute();


    return true;
  }

  async update(id: string, updateTrackInput: UpdateTrackInput): Promise<Track> {
    await this.trackRepository.update(id, updateTrackInput);
    return await this.findOne(id);
  }

  async remove(id: string): Promise<any> {
    const result = await this.trackRepository.delete(id) as any;
    return result.affected > 0;
  }
}