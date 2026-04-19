import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSezoneDto {
  @IsDateString()
  @IsNotEmpty()
  pocetak: string;

  @IsDateString()
  @IsNotEmpty()
  kraj: string;
}
