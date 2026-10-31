export interface Agent {
  id: number;
  name: string;
  description: string;
  model: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
