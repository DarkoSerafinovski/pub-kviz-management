import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Sezona } from 'src/seasons/entities/sezona.entity';
import { DogadjajTim } from 'src/results/entities/dogadjaj-tim.entity';
import { ClanUcesce } from 'src/teams/entities/clan-ucesce.entity';

@Entity('dogadjaji')
export class Dogadjaj {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  naziv: string;

  @Column({ type: 'date' })
  datum_odrzavanja: Date;

  @Column()
  sezona_id: number;

  @ManyToOne(() => Sezona, (sezona) => sezona.dogadjaji, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sezona_id' })
  sezona: Sezona;

  @OneToMany(() => DogadjajTim, (dt) => dt.dogadjaj)
  rang_lista: DogadjajTim[];

  @OneToMany(() => ClanUcesce, (cu) => cu.dogadjaj)
  ucescaClanova: ClanUcesce[];
}
