import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination-client.dto';


@ApiTags('clients')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto); 
  }

  @Get()
  @ApiOperation({ summary: 'Lista clientes com paginação (Máx 16 por página)' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientService.findAll(paginationDto.page, paginationDto.limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.findOne(id); 
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateClientDto: UpdateClientDto
  ) {
    return this.clientService.update(id, updateClientDto); 
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clientService.remove(id); 
  }
}