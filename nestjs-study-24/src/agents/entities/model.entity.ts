export class ModelEntity {
  provider!: string;

  name!: string;

  contextWindow!: number;

  constructor(partial: Partial<ModelEntity>) {
    Object.assign(this, partial);
  }
}
