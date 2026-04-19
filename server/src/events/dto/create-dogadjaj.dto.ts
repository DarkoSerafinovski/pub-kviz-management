import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDateString, IsInt } from 'class-validator';

export class CreateDogadjajDto {
  @IsString()
  @IsNotEmpty({ message: 'Naziv događaja je obavezan' })
  naziv: string;

  @IsDateString({}, { message: 'Datum mora biti u formatu YYYY-MM-DD' })
  @IsNotEmpty()
  datum_odrzavanja: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  sezona_id: number;
}
