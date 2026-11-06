import {
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
} from 'class-validator';

export function MaxPasswordBytes(
  maxBytes: number,
  validationOptions?: ValidationOptions,
) {
  return function (
    target: object,
    propertyName: string,
  ) {
    registerDecorator({
      name: 'maxPasswordBytes',

      target: target.constructor,

      propertyName,

      constraints: [maxBytes],

      options: validationOptions,

      validator: {
        validate(
          value: unknown,
          args: ValidationArguments,
        ) {
          if (typeof value !== 'string') {
            return false;
          }

          const [max] = args.constraints as [
            number,
          ];

          return (
            Buffer.byteLength(
              value,
              'utf8',
            ) <= max
          );
        },

        defaultMessage() {
          return '密码不能超过 72 个 UTF-8 字节';
        },
      },
    });
  };
}
