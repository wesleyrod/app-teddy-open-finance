import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health') 
@Controller('healthz')
export class HealthController {
  
  @Get()
  @ApiOperation({ summary: 'Verifica o status da API e do Banco de Dados' })
  @ApiResponse({ status: 200, description: 'API Funcionando...' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'teddy-open-finance-api'
    };
  }
}