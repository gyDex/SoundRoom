import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackInput } from './dto/create-track.input';
import { Favorite } from '../favorite/entities/favorite.entity';
import { Artist } from '../artist/entities/artist.entity';
import { parseFile } from 'music-metadata';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,

    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,

    @InjectRepository(Artist)
    private artistRepo: Repository<Artist>,

    private dataSource: DataSource
  ) {}

  async getDayPlaylist(userId?: string, limit: number = 20): Promise<Track[]> {
    console.log('dayPlaylist', 'tracks')

    const hour = new Date().getHours();
    let timeContext: string;
    
    if (hour >= 6 && hour < 12) {
      timeContext = 'morning';
    } else if (hour >= 12 && hour < 18) {
      timeContext = 'day';
    } else if (hour >= 18 && hour < 22) {
      timeContext = 'evening';
    } else {
      timeContext = 'night';
    }

    const bpmRanges = {
      morning: { min: 90, max: 120 },  
      day: { min: 110, max: 140 },      
      evening: { min: 80, max: 110 },   
      night: { min: 60, max: 90 },      
    };

    const range = bpmRanges[timeContext as keyof typeof bpmRanges];

    let preferredGenres: string[] = [];
    if (userId) {
      const favorites = await this.favoriteRepository.find({
        where: { user: { id: userId } },
        relations: ['track'],
      });
      
      const genreCount = new Map<string, number>();
      favorites.forEach(fav => {
        if (fav.track?.genre) {
          genreCount.set(fav.track.genre, (genreCount.get(fav.track.genre) || 0) + 1);
        }
      });
      
      preferredGenres = Array.from(genreCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([genre]) => genre);
    }

    const queryBuilder = this.trackRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.artist', 'artist')
      .where('track.bpm BETWEEN :minBpm AND :maxBpm', {
        minBpm: range.min,
        maxBpm: range.max,
      });

    if (preferredGenres.length > 0) {
      queryBuilder.orWhere('track.genre IN (:...genres)', { genres: preferredGenres });
    }

    const tracks = await queryBuilder
      .orderBy('track.created_at', 'DESC')
      .limit(limit)
      .getMany();


    return tracks.sort(() => Math.random() - 0.5);
  }

  async create(input: CreateTrackInput, filePath: string) { 
    const artist = await this.artistRepo.findOneBy({ id: input.artistId });
    if (!artist) throw new BadRequestException('Artist not found');

    let extractedBpm = 120; 
    let extractedDuration = input.duration || 0;
    let extractedGenre = input.genre || 'Unknown';

    try {
      const metadata = await parseFile(filePath);
      
      extractedBpm = metadata.common.bpm || 120;
      
      extractedDuration = Math.round(metadata.format.duration || input.duration);
      
      if (metadata.common.genre && metadata.common.genre.length > 0) {
        extractedGenre = metadata.common.genre[0];
      }
    } catch (error) {
      console.warn('Не удалось извлечь метаданные из файла, используем значения по умолчанию', error);
    }

    const track = this.trackRepository.create({
      name: input.name,
      duration: extractedDuration,
      genre: extractedGenre,
      bpm: extractedBpm,
      urlFile: input.urlFile,
      artist, 
    });

    return this.trackRepository.save(track);
  }

  async getSimilarTracks(trackId: string, limit: number = 10): Promise<Track[]> {
    const targetTrack = await this.trackRepository.findOne({
      where: { id: trackId },
      select: ['id', 'embedding'], 
    });

    if (!targetTrack || !targetTrack.embedding) {
      // ← ВОТ ЗДЕСЬ ИСПОЛЬЗУЕМ НАШ НОВЫЙ МЕТОД
      return this.getPopularSongs(limit);
    }

    const query = `
      SELECT t.id
      FROM track t
      WHERE t.id != $1
      ORDER BY t.embedding <=> $2 ASC
      LIMIT $3
    `;
    
    const embeddingStr = `[${targetTrack.embedding.join(',')}]`;
    const rawResults = await this.dataSource.query(query, [trackId, embeddingStr, limit]);
    const similarIds = rawResults.map((row: any) => row.id);

    if (similarIds.length === 0) {
      // Если похожих треков не нашлось (например, трек первый в базе)
      return this.getPopularSongs(limit);
    }

    return this.findByIds(similarIds);
  }
  

  async getArtistRadio(artistId: string, limit: number = 20): Promise<Track[]> {
    const artistSongs = await this.trackRepository.find({ 
      where: { artist: { id: artistId } }, 
      relations: ['artist'],
      take: Math.floor(limit * 0.4),
      order: { created_at: 'DESC' } 
    });
    
    if (artistSongs.length > 0) {
      const similar = await this.getSimilarTracks(artistSongs[0].id, Math.floor(limit * 0.6));
      return [...artistSongs, ...similar].sort(() => Math.random() - 0.5);
    }
    
    return this.getPopularSongs(limit);
  }

  async getPopularSongs(limit: number = 10): Promise<Track[]> {
    // Используем QueryBuilder для более эффективного запроса
    return this.trackRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.artist', 'artist')
      .orderBy('track.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }


  async findAll(): Promise<Track[]> {
    const result =  await this.trackRepository.find(
      {
        relations: ['artist']  
      }
    );
    console.log(result, 'result')
    return result;
  }

  async findOne(id: any): Promise<any> {
    return await this.trackRepository.findOne({ 
      where: { id },
      relations: ['artist']
    });
  }

  async findByIds(ids: string[]): Promise<Track[]> {
  return this.trackRepository.find({
    where: { id: In(ids) },
    relations: ['artist'], // подгружаем артиста
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

    if (exists) {
      await this.favoriteRepository.delete(exists.id);
      return false;
    }

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

  // async update(id: string, updateTrackInput: UpdateTrackInput): Promise<Track> {
  //   await this.trackRepository.update(id, updateTrackInput);
  //   return await this.findOne(id);
  // }

  async remove(id: string): Promise<any> {
    const result = await this.trackRepository.delete(id) as any;
    return result.affected > 0;
  }
}