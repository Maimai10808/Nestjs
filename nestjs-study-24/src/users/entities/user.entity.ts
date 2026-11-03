import {
  Exclude,
  Expose,
} from 'class-transformer';

export class UserEntity {
  id!: number;

  firstName!: string;

  lastName!: string;

  email!: string;

  @Exclude()
  passwordHash!: string;

  @Exclude()
  apiKey!: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
