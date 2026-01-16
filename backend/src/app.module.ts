import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TrackModule } from './track/track.module';
import { SupabaseService } from './supabase/supabase.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadController } from './supabase/upload.resolver';
import { PlaylistModule } from './playlist/playlist.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FriendsModule } from './friends/friends.module';
import { PartyModule } from './party/party.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, '..', '.env'), // Явно указываем путь
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:       "REMOVED",
      logging: true, 
      synchronize: false,
      ssl: true,
      entities: ['dist/**/*.entity{.ts,.js}'],
      extra: {
        ssl: {
          rejectUnauthorized: false
        },
        max: 10,
      },
    }),
    TrackModule,
    PlaylistModule,
    UsersModule,
    AuthModule,
    FriendsModule,
    PartyModule,
  ],
  controllers: [UploadController],
  providers: [ConfigService, SupabaseService],
})
export class AppModule {}