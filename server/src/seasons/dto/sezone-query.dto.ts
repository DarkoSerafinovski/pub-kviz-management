import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class SezoneQueryDto {
  @IsOptional() @IsString() pocetak?: string;
  @IsOptional() @IsString() kraj?: string;
  @IsOptional() @Type(() => Number) page?: number = 1;
}
