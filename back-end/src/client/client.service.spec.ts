import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { Client } from './entities/client.entity';
import { NotFoundException } from '@nestjs/common';

describe('ClientService', () => {
  let service: ClientService;

  const mockClientRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    softDelete: jest.fn(),
    softRemove: jest.fn(),
    find: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should throw NotFoundException if client to remove does not exist', async () => {
    mockClientRepository.findOneBy.mockResolvedValue(null);

    await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
  });
});