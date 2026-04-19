import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Tim } from './team.entity';
import { Dogadjaj } from '../../events/entities/dogadjaj.entity';
import { Clan } from './clan.entity';

@Entity('clan_ucesce')
export class ClanUcesce {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tim_id: number;

  @ManyToOne(() => Tim, (tim) => tim.clanUcesce)
  @JoinColumn({ name: 'tim_id' })
  tim: Tim;

  @Column()
  clan_id: number;

  @ManyToOne(() => Clan, (clan) => clan.ucesca)
  @JoinColumn({ name: 'clan_id' })
  clan: Clan;

  @Column()
  dogadjaj_id: number;

  @ManyToOne(() => Dogadjaj, (dogadjaj) => dogadjaj.ucescaClanova)
  @JoinColumn({ name: 'dogadjaj_id' })
  dogadjaj: Dogadjaj;
}
