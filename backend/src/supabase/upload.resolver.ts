import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from './supabase.service';
import { TrackService } from 'src/track/track.service';
import * as path from 'path'
import { randomUUID } from 'crypto';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly trackService: TrackService,
  ) {}

  @Get()
  async test() {
    return { message: 'Upload controller is working!', timestamp: new Date() };
  }

  @Get('test-connection')
  async testConnection() {
    return await this.supabaseService.testConnection();
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageFile(@UploadedFile() file: Express.Multer.File) {
    const fileName = `${Date.now()}-${file.originalname}`;
    await this.supabaseService.uploadFile(
      fileName,
      file.buffer,
      file.mimetype,
      'images'
    );
    
    const permanentUrl = await this.supabaseService.createPermanentAccess(fileName);

    return {
      fileUrl: permanentUrl
    }
  }

  @Post('track')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrackFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    const trackData = body;

    if (!file) {
      throw new BadRequestException('File is required');
    }

    console.log('Uploaded file:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });


    const ext = path.extname(file.originalname); // например .mp3
    const safeFileName = `${Date.now()}-${randomUUID()}${ext}`;
    await this.supabaseService.uploadFile(
      safeFileName,
      file.buffer,
      file.mimetype,
      'files'
    );

    // Получаем публичный URL
    const fileUrl = await this.supabaseService.getPublicUrl(safeFileName);

    const duration = await  this.supabaseService.getAudioDuration(file.buffer, file)

    this.trackService.create({
      name: trackData.name,
      artist: trackData.artist ?? 'Unknown Artist',
      duration: Math.floor(duration),
      genre: trackData.genre ?? 'Unknown Genre',
      urlFile: fileUrl,
    })

    console.log(this.trackService.findAll().then((data) => console.log(data)))


    return {
      message: 'File uploaded successfully',
      url: fileUrl,
      filename: file.originalname,
      track: {
        name: trackData.name,
        artist: trackData.artist ?? 'Unknown Artist',
        duration: Math.floor(duration),
        genre: trackData.genre ?? 'Unknown Genre',
        urlFile: fileUrl,
        created_at: trackData.created_at
      }
    };
  }
}