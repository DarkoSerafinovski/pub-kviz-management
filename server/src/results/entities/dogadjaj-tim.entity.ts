import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Dogadjaj } from '../../events/entities/dogadjaj.entity';
import { Tim } from '../../teams/entities/team.entity';

@Entity('dogadjaj_tim')
export class DogadjajTim {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column()
  dogadjaj_id: number;

  @ManyToOne(() => Dogadjaj, (dogadjaj) => dogadjaj.rang_lista)
  @JoinColumn({ name: 'dogadjaj_id' })
  dogadjaj: Dogadjaj;

  @Column()
  tim_id: number;

  @ManyToOne(() => Tim, (tim) => tim.rezultati)
  @JoinColumn({ name: 'tim_id' })
  tim: Tim;
}
export class Rezultati {}
