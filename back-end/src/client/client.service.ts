import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto) {
    const client = await this.repository.create(createClientDto);
    return await this.repository.save(client);
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const client = await this.repository.findOneBy({ id });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    client.viewCount += 1;
    return await this.repository.save(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.repository.preload({ id, ...updateClientDto });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return await this.repository.save(client);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    return await this.repository.softRemove(client);
  }
}