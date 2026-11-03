import {
  Exclude,
  Expose,
  Transform,
} from 'class-transformer';

import { ModelEntity } from './model.entity.js';

export class AgentEntity {
  id!: number;

  name!: string;

  description!: string;

  @Transform(
    ({ value }: { value: ModelEntity }) => value.name,
    { toPlainOnly: true },
  )
  model!: ModelEntity;

  enabled!: boolean;

  @Exclude()
  apiKey!: string;

  @Exclude()
  systemPrompt!: string;

  @Exclude()
  totalCost!: number;

  @Expose()
  get status(): string {
    return this.enabled ? 'available' : 'disabled';
  }

  constructor(partial: Partial<AgentEntity>) {
    Object.assign(this, partial);
  }
}
