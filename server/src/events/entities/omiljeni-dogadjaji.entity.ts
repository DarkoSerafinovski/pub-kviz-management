import { Entity, PrimaryColumn } from 'typeorm';

@Entity('omiljeni_dogadjaji')
export class OmiljeniDogadjaj {
  @PrimaryColumn()
  user_id: string;

  @PrimaryColumn()
  dogadjaj_id: number;
}
