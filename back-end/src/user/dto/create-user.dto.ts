import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsNotEmpty } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Wesley' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'wesley@email.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}