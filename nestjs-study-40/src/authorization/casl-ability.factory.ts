import { Injectable } from '@nestjs/common';

import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
  type ExtractSubjectType,
  type InferSubjects,
} from '@casl/ability';

import { Agent } from '../agents/agent.entity.js';

import { Action } from './action.enum.js';

import { Role } from './role.enum.js';

export interface CurrentUser {
  id: number;
  role: Role;
}

type Subjects =
  | InferSubjects<typeof Agent>
  | 'all';

export type AppAbility = MongoAbility<
  [Action, Subjects]
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: CurrentUser): AppAbility {
    const { can, cannot, build } =
      new AbilityBuilder<AppAbility>(
        createMongoAbility,
      );

    if (user.role === Role.ADMIN) {
      // 管理员可以管理所有资源
      can(Action.Manage, 'all');
    } else {
      // 普通用户可以创建 Agent
      can(Action.Create, Agent);

      // 可以读取自己的 Agent
      can(Action.Read, Agent, {
        ownerId: user.id,
      });

      // 可以更新自己的 Agent
      can(Action.Update, Agent, {
        ownerId: user.id,
      });

      // 可以删除自己的 Agent
      can(Action.Delete, Agent, {
        ownerId: user.id,
      });

      // 可以执行自己的 Agent
      can(Action.Execute, Agent, {
        ownerId: user.id,
      });
    }

    // 无论管理员还是普通用户，
    // 都不能删除正在运行的 Agent
    cannot(Action.Delete, Agent, {
      status: 'running',
    });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
