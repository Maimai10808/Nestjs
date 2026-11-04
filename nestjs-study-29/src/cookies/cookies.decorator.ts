import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const Cookies = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx
      .switchToHttp()
      .getRequest();

    const cookies = request.cookies;

    return data
      ? cookies?.[data]
      : cookies;
  },
);
