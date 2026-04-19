import { Profile } from 'src/users/entities/profile.entity';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClanUcesce } from './clan-ucesce.entity';

@Entity('timovi')
export class Tim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  naziv: string;

  @Column({ nullable: true })
  logo: string;

  @OneToOne(() => Profile, (profile) => profile.team)
  @JoinColumn({ name: 'profile_id' })
  profile: Profile;

  @OneToMany(() => ClanUcesce, (ucesce) => ucesce.tim)
  clanUcesce: ClanUcesce[];

  @OneToMany(() => DogadjajTim, (dt) => dt.tim)
  rezultati: DogadjajTim[];
}
