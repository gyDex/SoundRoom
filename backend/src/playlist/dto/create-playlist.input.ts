import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID } from 'class-validator';
import { CreateDateColumn } from 'typeorm';

@InputType()
export class CreatePlaylistInput {
    @Field(() => ID)
    @IsUUID()
    userId: string;     

    @Field()
    @IsString()
    name: string;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    imageUrl?: string;

    @Field(() => [ID], { nullable: true })
    trackIds?: string[];

    @Field(() => Date, { nullable: true }) 
    @CreateDateColumn({ 
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;

    @Field(() => Date, { nullable: true }) 
    @CreateDateColumn({ 
        name: 'update_at',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;
}