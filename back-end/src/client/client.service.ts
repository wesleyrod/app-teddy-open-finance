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

  create(createClientDto: CreateClientDto) {
    const client = this.repository.create(createClientDto);
    return this.repository.save(client);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: string) {
    const client = await this.repository.findOneBy({ id });
    if (!client) throw new NotFoundException('Cliente não encontrado');

    client.viewCount += 1;
    return this.repository.save(client);
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.repository.preload({ id, ...updateClientDto });
    if (!client) throw new NotFoundException('Cliente não encontrado');
    return this.repository.save(client);
  }

  async remove(id: string) {
    const client = await this.findOne(id);
    return this.repository.softRemove(client);
  }
}