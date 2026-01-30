import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistInput } from './dto/create-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';
import { Artist } from './entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
  ) {}

  // CREATE
  async create(input: CreateArtistInput): Promise<Artist> {
    const artist = this.artistRepository.create({
      name: input.name,
      genre: input.genre,
      imageUrl: input.imageUrl
    });

    if (input.tracks?.length) {
      artist.tracks = input.tracks.map(trackInput => {
        const track = new Track();
        track.name = trackInput.name;
        track.duration = trackInput.duration;
        track.artist = artist;
        return track;
      });
    }

    return this.artistRepository.save(artist);
  }

  // READ ALL
  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find({
      relations: ['tracks'],
    });
  }

  // READ ONE
async findOne(id: string): Promise<Artist> {
  const artist = await this.artistRepository.findOne({
    where: { id },
    relations: {
      tracks: {
        artist: true, // 🔥 ВОТ ЭТО КЛЮЧЕВО
      },
    },
  });

  if (!artist) {
    throw new NotFoundException(`Artist with id ${id} not found`);
  }

  return artist;
}

  // UPDATE
  async update(
    id: string,
    input: UpdateArtistInput,
  ): Promise<Artist> {
    const artist = await this.findOne(id);

    Object.assign(artist, input);

    return this.artistRepository.save(artist);
  }

  // DELETE
  async remove(id: string): Promise<boolean> {
    const result = await this.artistRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`Artist with id ${id} not found`);
    }

    return true;
  }
}
