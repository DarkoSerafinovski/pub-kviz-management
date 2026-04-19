import { IsInt, Min, IsNotEmpty } from 'class-validator';

export class UpdateRezultatDto {
  @IsInt()
  @IsNotEmpty()
  dogadjaj_id: number;

  @IsInt()
  @IsNotEmpty()
  tim_id: number;

  @IsInt()
  @Min(0, { message: 'Bodovi ne mogu biti negativni' })
  score: number;
}
