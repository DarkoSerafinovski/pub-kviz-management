import { IsOptional, IsString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class DogadjajiQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sezona_id?: number;

  @IsOptional()
  @Type(() => Boolean)
  omiljeni?: boolean;

  @IsOptional()
  @IsString()
  naziv?: string;

  @IsOptional()
  @IsDateString()
  datumOdrzavanja?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;
}
