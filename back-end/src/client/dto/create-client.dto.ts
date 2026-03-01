import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDto {
  @ApiProperty({ example: 'Wesley' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  salary!: number;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  companyValue!: number;
}