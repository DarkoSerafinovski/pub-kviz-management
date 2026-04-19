import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ClanUcesce } from './clan-ucesce.entity';

@Entity('clanovi')
export class Clan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ime: string;

  @Column()
  prezime: string;

  @OneToMany(() => ClanUcesce, (ucesce) => ucesce.clan)
  ucesca: ClanUcesce[];
}
