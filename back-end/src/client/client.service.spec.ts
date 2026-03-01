import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClientService', () => {
  let service: ClientService;

  const mockClientRepository = {
    findOneBy: jest.fn(), 
    softRemove: jest.fn(), 
    find: jest.fn(),
    create: jest.fn().mockImplementation(dto => ({ id: 'uuid', ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: getRepositoryToken(Client),
          useValue: mockClientRepository,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
    jest.clearAllMocks();
  });

  it('should throw NotFoundException if client does not exist', async () => {
    mockClientRepository.findOneBy.mockResolvedValue(null);
    await expect(service.remove('invalid')).rejects.toThrow(NotFoundException);
  });
});