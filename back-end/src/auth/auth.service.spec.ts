import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'uuid-123',
    name: 'Test User',
    email: 'test@teddy.com',
    password: 'hashed-password',
    role: 'user',
  };

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access_token and user on successful signIn', async () => {
    mockUserService.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await service.signIn('test@teddy.com', 'password123');

    expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@teddy.com');
    expect(result).toHaveProperty('access_token', 'mock-token');
    expect(result).toHaveProperty('user');
    expect(result.user).toEqual({
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    });
  });

  it('should throw UnauthorizedException when user is not found', async () => {
    mockUserService.findByEmail.mockResolvedValue(null);

    await expect(service.signIn('wrong@teddy.com', 'password123'))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    mockUserService.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.signIn('test@teddy.com', 'wrong-password'))
      .rejects
      .toThrow(UnauthorizedException);
  });
});