import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch()
export class AllExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToWs();
    const client = ctx.getClient();
    if (exception instanceof WsException) {
      const exc = exception.getError() as { [key: string]: string };
      client.emit('exception', {
        error: exc.error || 'Bad Request',
        message: exc.message || exception.message,
      });
    } else if (exception instanceof HttpException) {
      const response = exception.getResponse() as any;
      client.emit('exception', {
        error: response.error || 'Unknown',
        message: response.message || 'Something went wrong',
      });
    } else super.catch(exception, host);
  }
}
