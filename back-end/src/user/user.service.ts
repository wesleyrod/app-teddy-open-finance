import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.repository.findOneBy({ email: createUserDto.email });
    if (userExists) throw new ConflictException('E-mail já cadastrado');

    const hashedPassword = await bcrypt.hash(createUserDto.password, this.saltRounds);
    const user = await this.repository.create({ ...createUserDto, password: hashedPassword });
    
    const savedUser = await this.repository.save(user);
    const { password: _, ...result } = savedUser;
    return result;
  }

  async findAll() {
    return await this.repository.find();
  }

  async findOne(id: string) {
    const user = await this.repository.findOneBy({ id });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async findByEmail(email: string) {
    return await this.repository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }
    const user = await this.repository.preload({ id, ...updateUserDto });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return await this.repository.save(user);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.repository.remove(user);
  }
}