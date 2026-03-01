import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('AuditLog');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const userId = user?.userId || 'Anonymous';
        const duration = Date.now() - now;

        if (['POST', 'PATCH', 'DELETE'].includes(method)) {
          this.logger.log(
            `[AUDIT] User: ${userId} | Action: ${method} ${url} | Duration: ${duration}ms | Payload: ${JSON.stringify(body)}`
          );
        }
      }),
    );
  }
}