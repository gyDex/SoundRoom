import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/track/entities/playlist.entity';
import { In, Repository } from 'typeorm';
import { CreatePlaylistInput } from './dto/create-playlist.input';
import { DeletePlaylistInput } from './dto/delete-playlist.input';
import { EditPlaylistInput } from './dto/edit-playlist.input';
import { Track } from 'src/track/entities/track.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRes: Repository<Playlist>,

        @InjectRepository(Track)
        private trackRes: Repository<Track>
    ) {}

    async findAll(): Promise<Playlist[]> {
        return this.playlistRes.find({
            relations: ['tracks']  
        });
    }

    async findOne(id: string): Promise<Playlist | null> {
            const playlist = await this.playlistRes.findOne({ where: { id } });
    if (!playlist) return null;

    // подтягиваем все треки по trackIds
    const tracks = await this.trackRes.find({
      where: { id: In(playlist.trackIds || []) },
      relations: ['artist'], // подтягиваем артиста
    });

    console.log(tracks, 'tracks')

    return { ...playlist, tracks };
    }


    async findByUserID(userId: string): Promise<Playlist[]> {
    return this.playlistRes.find({
        where: { userId },
        relations: ['tracks', 'tracks.artist'], // обязательно вложенно
    });
    }

    async create(createPlaylistInput: CreatePlaylistInput): Promise<Playlist> {
        const playlist = await this.playlistRes.create(createPlaylistInput);
        return await this.playlistRes.save(playlist);
    }

    async edit(editPlaylistInput: EditPlaylistInput): Promise<Playlist> {
        try {
            await this.playlistRes.update(editPlaylistInput.id, editPlaylistInput);
            return this.playlistRes.findOneOrFail({ where: { id: editPlaylistInput.id } });
        } catch (error) {
            return error;   
        }
    }

    async delete(deletePlaylistInput: DeletePlaylistInput): Promise<Playlist>  {
        const playlist = await this.playlistRes.findOne({
            where: { id: deletePlaylistInput.playlistId },
        });

        if (!playlist) {
            throw new Error('Playlist not found');
        }

        await this.playlistRes.delete(deletePlaylistInput.playlistId);

        return playlist;
    }
}
