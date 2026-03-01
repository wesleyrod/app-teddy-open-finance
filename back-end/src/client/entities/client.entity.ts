import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {} from 'class-validator';

@Entity('clients')
export class Client {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty()
  @Column()
  name!: string;

  @ApiProperty()
  @Column('decimal', { precision: 15, scale: 2 })
  salary!: number;

  @ApiProperty()
  @Column('decimal', { precision: 15, scale: 2 })
  companyValue!: number;

  @ApiProperty({ description: 'Contador de visualizações do cliente' })
  @Column({ default: 0 })
  viewCount!: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}