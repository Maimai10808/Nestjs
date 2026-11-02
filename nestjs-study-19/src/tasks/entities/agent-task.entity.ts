import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Agent } from '../../agents/entities/agent.entity.js';

export enum AgentTaskStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('agent_tasks')
export class AgentTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  agentId: number;

  @Column({ type: 'text' })
  input: string;

  @Column({
    type: 'enum',
    enum: AgentTaskStatus,
    default: AgentTaskStatus.PENDING,
  })
  status: AgentTaskStatus;

  @Column({ type: 'text', nullable: true })
  output: string | null;

  @ManyToOne(() => Agent, (agent) => agent.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'agentId' })
  agent: Agent;

  @CreateDateColumn()
  createdAt: Date;
}
