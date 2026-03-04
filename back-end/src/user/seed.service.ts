import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    const adminEmail = 'admin@teddy.com.br';
    const adminPassword = 'admin123';

    let user = await this.userRepository.findOne({
      where: { email: adminEmail },
      select: ['id', 'email', 'password'],
    });

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    if (user) {
      // Atualiza a senha para garantir que está correta
      user.password = hashedPassword;
      await this.userRepository.save(user);
      this.logger.log(`Senha do admin (${adminEmail}) atualizada com sucesso.`);
    } else {
      // Cria o usuário admin
      const admin = this.userRepository.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      this.logger.log(`Usuário admin (${adminEmail}) criado com sucesso.`);
    }
  }
}
