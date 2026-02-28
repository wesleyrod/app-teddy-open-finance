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

  // 1. CREATE com Hashing de Senha
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const userExists = await this.repository.findOneBy({ email });
    if (userExists) {
      throw new ConflictException('Este e-mail já está em uso');
    }

    const hashedPassword = await bcrypt.hash(password, this.saltRounds);
    
    const user = this.repository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.repository.save(user);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, this.saltRounds);
    }

    const updatedUser = await this.repository.preload({
      id,
      ...updateUserDto,
    });

    return await this.repository.save(updatedUser!);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.repository.remove(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'role'],
    });
  }
}