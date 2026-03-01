import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    findOneBy: jest.fn(),
    create: jest.fn().mockImplementation(dto => ({ id: 'uuid', ...dto })),
    save: jest.fn().mockImplementation(u => Promise.resolve(u)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user with VIEWER role', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);
    const result = await service.create({ 
      name: 'Wesley', email: 'w@t.com', password: '123', role: UserRole.VIEWER 
    });
    expect(result.role).toBe('viewer'); 
  });
});