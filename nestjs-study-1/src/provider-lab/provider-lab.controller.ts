import { Controller, Get } from '@nestjs/common';

import { SingletonService } from './scope/singleton.service.js';
import { RequestService } from './scope/request.service.js';
import { TransientService } from './scope/transient.service.js';
import { ConfigService } from './custom/config.service.js';
import { NotificationService } from './optional/notification.service.js';

@Controller('provider-lab')
export class ProviderLabController {
  constructor(
    private readonly singletonService: SingletonService,
    private readonly requestService: RequestService,
    private readonly transientService: TransientService,
    private readonly configService: ConfigService,
    private readonly notificationService: NotificationService,
  ) {}

  @Get('scope')
  getScope() {
    return {
      singleton: this.singletonService.getInfo(),
      request: this.requestService.getInfo(),
      transient: this.transientService.getInfo(),
    };
  }

  @Get('config')
  getConfig() {
    return this.configService.getConfig();
  }

  @Get('optional')
  getOptional() {
    return this.notificationService.notify('Hello NestJS');
  }
}
