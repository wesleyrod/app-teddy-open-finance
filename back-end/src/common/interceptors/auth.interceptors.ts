import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('StructuredAudit');

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, ip } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const logData = {
          timestamp: new Date().toISOString(),
          context: 'AUDIT',
          userId: user?.userId || 'anonymous',
          method,
          url,
          ip,
          duration: `${Date.now() - now}ms`,
          payload: method !== 'GET' ? body : undefined, 
        };

        this.logger.log(JSON.stringify(logData));
      }),
    );
  }
}