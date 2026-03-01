import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User, UserRole } from './entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation(dto => dto),
    save: jest.fn().mockImplementation(user => 
      Promise.resolve({ id: 'mock-uuid', ...user })
    ),
    findOne: jest.fn(),
    findOneBy: jest.fn().mockResolvedValue(null),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with VIEWER role', async () => {
    const userDto = { 
      name: 'Wesley', 
      email: 'wesley@teddy.com', 
      password: '123', 
      role: UserRole.VIEWER
    };
    
    const result = await service.create(userDto);
    expect(result).toHaveProperty('id');
    expect(result.role).toEqual('viewer'); 
  });
});