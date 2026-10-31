import {
  Injectable,
  Inject,
  Optional,
} from '@nestjs/common';

export const EMAIL_CLIENT = Symbol('EMAIL_CLIENT');

export interface EmailClient {
  send(message: string): string;
}

@Injectable()
export class NotificationService {
  constructor(
    @Optional()
    @Inject(EMAIL_CLIENT)
    private readonly emailClient?: EmailClient,
  ) {}

  notify(message: string) {
    const result = {
      message,
      emailEnabled: Boolean(this.emailClient),
      emailResult: this.emailClient?.send(message) ?? null,
    };

    return result;
  }
}
