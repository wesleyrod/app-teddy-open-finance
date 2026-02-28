import { IsString, IsNumber, Min } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  salary: number;

  @IsNumber()
  @Min(0)
  companyValue: number;
}