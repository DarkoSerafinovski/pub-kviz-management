import {
  IsInt,
  IsNotEmpty,
  IsArray,
  IsString,
  IsOptional,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class ClanPrijavaDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  @IsNotEmpty()
  ime: string;

  @IsString()
  @IsNotEmpty()
  prezime: string;
}

export class PrijavaTimaDto {
  @IsInt()
  @IsNotEmpty()
  dogadjaj_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClanPrijavaDto)
  @MinLength(1, { message: 'Morate prijaviti barem jednog člana.' })
  clanovi: ClanPrijavaDto[];
}
