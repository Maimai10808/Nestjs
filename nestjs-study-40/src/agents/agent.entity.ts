export class Agent {
  id!: number;

  name!: string;

  ownerId!: number;

  model!: string;

  status!: 'idle' | 'running';
}
