import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from 'src/track/entities/playlist.entity';
import { In, Repository } from 'typeorm';
import { CreatePlaylistInput } from './dto/create-playlist.input';
import { Track } from 'src/track/track.entity';
import { DeletePlaylistInput } from './dto/delete-playlist.input';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(Playlist)
        private playlistRes: Repository<Playlist>,

    ) {}

    async findAll(): Promise<Playlist[]> {
        return this.playlistRes.find({
            relations: ['tracks']  
        });
    }

    async findOne(id: string): Promise<Playlist | null> {
        return this.playlistRes.findOne({ where: { id } });
    }

    async findByUserID(userId: any): Promise<any> {
        return await this.playlistRes.find({ 
            where: { userId: userId } ,
            relations: ['tracks'] 
        });
    }

    async create(createPlaylistInput: CreatePlaylistInput): Promise<Playlist> {
        const playlist = this.playlistRes.create(createPlaylistInput);
        return await this.playlistRes.save(playlist);
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
