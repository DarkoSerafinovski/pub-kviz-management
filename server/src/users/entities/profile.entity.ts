import { Tim } from 'src/teams/entities/team.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  role: string;

  @OneToOne(() => Tim, (tim) => tim.profile)
  team: Tim;
}
