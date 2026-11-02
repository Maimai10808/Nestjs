import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity.js';
import { AgentTask } from '../../tasks/entities/agent-task.entity.js';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  model: string;

  @Column({ default: true })
  enabled: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.agents, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => AgentTask, (task) => task.agent)
  tasks: AgentTask[];

  @CreateDateColumn()
  createdAt: Date;
}
