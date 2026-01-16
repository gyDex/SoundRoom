// supabase.service.ts
import { Injectable, Logger, UploadedFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as mm from 'music-metadata';

import * as crypto from 'crypto'

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    // Валидация переменных окружения
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration is missing. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      });
  }

  async getPublicUrl(path: string): Promise<string> {
      const { data } = this.supabase.storage
      .from('files')
      .getPublicUrl(path);
      
      return data.publicUrl;
  }

  async testConnection(): Promise<any> {
      try {
        const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
        const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY') || 
        this.configService.get<string>('SUPABASE_KEY');

        console.log(supabaseKey)
        console.log(supabaseUrl)

        this.logger.log(`Testing connection to: ${supabaseUrl}`);
        this.logger.log(`Using key: ${supabaseKey?.substring(0, 10)}...`);

        const healthResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          }
        } as any);

        this.logger.log(`Health check status: ${healthResponse.status}`);

        const storageResponse = await fetch(`${supabaseUrl}/storage/v1/bucket`, {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          }
        } as any);

        const storageText = await storageResponse.text();
        this.logger.log(`Storage API status: ${storageResponse.status}`);
        this.logger.log(`Storage response: ${storageText.substring(0, 200)}...`);

        return {
          healthStatus: healthResponse.status,
          storageStatus: storageResponse.status,
          storageResponse: storageText
        };

      } catch (error) {
        this.logger.error(`Connection test failed: ${error.message}`);
        return { error: error.message };
      }
  } 

  async uploadFile(
    filePath: string,
    file: Buffer,
    fileType: string,
    storage: string,
  ): Promise<{ path: string | null; publicUrl: string | null ; error: any }> {
    try {
      // Загружаем файл
      const { data, error } = await this.supabase
        .storage
        .from(storage)
        .upload(filePath, file, {
          contentType: fileType,
          upsert: false
        });

      console.log(error)

      if (error) {
        this.logger.error(`Upload error: ${error.message}`);
        return { path: null, publicUrl: null, error };
      }

      // Получаем корректный публичный URL
      const { data: urlData } = this.supabase
        .storage
        .from('files')
        .getPublicUrl(filePath);

      return { 
        path: data.path, 
        publicUrl: urlData.publicUrl,
        error: null 
      };

    } catch (error) {
      this.logger.error(`Unexpected error: ${error.message}`);
      return { path: null, publicUrl: null, error };
    }
  }

  async getAudioDuration(buffer: Buffer, file: Express.Multer.File): Promise<number> {
    try {
      const metadata = await mm.parseBuffer(buffer, file.mimetype);
      return metadata.format.duration || 0;
    } catch (error) {
      console.error('Error parsing audio metadata:', error);
      return 0;
    }
  }

  async downloadFile(path: string): Promise<Buffer> {
    const { data, error } = await this.supabase.storage.from('files').download(path);
    console.log(data)

    if (error || !data) {
      throw new Error(error?.message || 'File not found');
    }
    return Buffer.from(await data.arrayBuffer());
  }

  async createPermanentAccess(fileName: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from('images')
      .createSignedUrl(fileName, 60 * 60 * 24 * 365 * 10); // 10 лет

    if (error) {
      throw new Error(`Error creating permanent URL: ${error.message}`);
    }

    return data.signedUrl;
  }
  
    async getPublicUrlWithToken(fileName: string): Promise<string> {
      const { data } = this.supabase.storage
        .from('images')
        .getPublicUrl(fileName);
      return `${data.publicUrl}?token=${await this.generateFileToken(fileName)}`;
    }
  
    private async generateFileToken(fileName: string): Promise<string> {
      return crypto.createHash('md5').update(fileName + process.env.FILE_SECRET).digest('hex');
    }

  getClient() {
    return this.supabase;
  }
}
