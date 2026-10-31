import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AgentQuotaException extends HttpException {
  constructor(
    limit: number,
    used: number,
  ) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Agent 调用额度已耗尽',
        errorCode: 'AGENT_QUOTA_EXCEEDED',
        limit,
        used,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
