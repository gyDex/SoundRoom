  import { User } from "../../auth/entities/user.entity";
  import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

  @Entity('party')
  export class PartyEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column()
    hostId: string;

    @Column({ default: false })
    isPrivate: boolean;

    @Column({
      type: 'enum',
      enum: ['active', 'closed'],
      default: 'active',
    })
    status: 'active' | 'closed';

    @Column({ nullable: true })
    password?: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    createdBy: string

    @ManyToMany(() => User, user => user.parties)
    @JoinTable({
      name: 'party_users', // название junction таблицы
      joinColumn: {
        name: 'party_id',
        referencedColumnName: 'id'
      },
      inverseJoinColumn: {
        name: 'user_id',
        referencedColumnName: 'id'
      }
    })
    connectedUsers: User[];
  }
