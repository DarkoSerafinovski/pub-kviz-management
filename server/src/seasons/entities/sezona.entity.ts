import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Check,
} from 'typeorm';
import { Dogadjaj } from 'src/events/entities/dogadjaj.entity';

@Entity('sezone')
@Check(`"kraj" > "pocetak"`)
export class Sezona {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  pocetak: Date;

  @Column({ type: 'date' })
  kraj: Date;

  @OneToMany(() => Dogadjaj, (dogadjaj) => dogadjaj.sezona)
  dogadjaji: Dogadjaj[];
}
