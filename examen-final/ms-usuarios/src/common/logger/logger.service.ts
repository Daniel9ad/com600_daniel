import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor(private configService: ConfigService) {
    this.createLogger();
  }

  private createLogger() {
    const logLevel = this.configService.get('LOG_LEVEL', 'info');
    const logDir = this.configService.get('LOG_DIR', './logs');
    const appName = this.configService.get('APP_NAME', 'nestjs-app');

    // Formato personalizado para logs con estructura específica
    const customFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.printf((info) => {
        // Si el log tiene los campos específicos (ip, usuario, accion), usar formato personalizado
        if (info.ip && info.usuario && info.accion) {
          return JSON.stringify({
            timestamp: info.timestamp,
            level: info.level,
            ip: info.ip,
            usuario: info.usuario,
            accion: info.accion,
            service: appName,
            environment: this.configService.get('NODE_ENV', 'development'),
            ...(typeof info.data === 'object' && info.data !== null ? info.data : {}),
            stack: info.stack
          });
        }
        
        // Para otros logs (sistema, errores generales), usar formato estándar
        return JSON.stringify({
          timestamp: info.timestamp,
          level: info.level,
          message: info.message,
          service: appName,
          environment: this.configService.get('NODE_ENV', 'development'),
          context: info.context,
          stack: info.stack
        });
      })
    );

    // Formato para consola (desarrollo)
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.printf((info) => {
        if (info.ip && info.usuario && info.accion) {
          return `${info.timestamp} [${info.level}] ${info.ip} | ${info.usuario} | ${info.accion}`;
        }
        return `${info.timestamp} [${info.level}] ${info.message}`;
      })
    );

    this.logger = winston.createLogger({
      level: logLevel,
      format: customFormat,
      defaultMeta: { service: appName },
      transports: [
        // Archivo rotativo para logs de aplicación
        new DailyRotateFile({
          filename: `${logDir}/application-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
          level: 'info'
        }),
        
        // Archivo rotativo para errores
        new DailyRotateFile({
          filename: `${logDir}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error'
        }),

        // Archivo rotativo para logs de acceso HTTP
        new DailyRotateFile({
          filename: `${logDir}/access-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '7d',
          level: 'http'
        })
      ],
    });

    // Agregar consola solo en desarrollo
    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: consoleFormat
      }));
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, stack?: string, context?: string) {
    this.logger.error(message, { context, stack });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Métodos con formato específico: IP, usuario, timestamp, acción
  logHttpRequest(req: any, res: any, responseTime: number) {
    const logData = {
      ip: this.getClientIp(req),
      usuario: req.user?.sub || 'anonymous',
      timestamp: new Date().toISOString(),
      accion: `${req.method} ${req.url}`,
      data: {
        statusCode: res.statusCode,
        responseTime: `${responseTime}ms`,
        userAgent: req.get('User-Agent') || '',
        requestId: req.id || null
      }
    };

    // Usar el logger directamente con los campos específicos
    this.logger.log({
      level: 'http',
      message: `${logData.accion}`,
      ...logData
    });
  }

  logBusinessEvent(accion: string, data: any, req?: any, userId?: string) {
    const logData = {
      ip: req ? this.getClientIp(req) : 'system',
      usuario: req?.user?.email || req?.user?.username || req?.user?.id || userId || 'system',
      timestamp: new Date().toISOString(),
      accion: accion,
      data: {
        ...data,
        type: 'business'
      }
    };

    this.logger.log({
      level: 'info',
      message: accion,
      ...logData
    });
  }

  // logSecurityEvent(accion: string, data: any, req?: any, userId?: string) {
  //   const logData = {
  //     ip: req ? this.getClientIp(req) : 'system',
  //     usuario: req?.user?.email || req?.user?.username || req?.user?.id || userId || 'anonymous',
  //     timestamp: new Date().toISOString(),
  //     accion: accion,
  //     data: {
  //       ...data,
  //       type: 'security'
  //     }
  //   };

  //   this.logger.log({
  //     level: 'warn',
  //     ...logData
  //   });
  // }

  // logUserAction(accion: string, req: any, additionalData?: any) {
  //   const logData = {
  //     ip: this.getClientIp(req),
  //     usuario: req.user?.email || req.user?.username || req.user?.id || 'anonymous',
  //     timestamp: new Date().toISOString(),
  //     accion: accion,
  //     data: additionalData || {}
  //   };

  //   this.logger.log({
  //     level: 'info',
  //     ...logData
  //   });
  // }

  private getClientIp(req: any): string {
    return req.ip || 
          req.connection?.remoteAddress || 
          req.socket?.remoteAddress ||
          req.headers['x-forwarded-for']?.split(',')[0] ||
          req.headers['x-real-ip'] ||
          'unknown';
  }
}