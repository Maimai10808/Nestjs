import { BadRequestException } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';
import type { CreateAgentDto } from '../dto/create-agent.dto.js';
import type { UpdateAgentDto } from '../dto/update-agent.dto.js';

// 本章没有引入 class-validator；显式检查 Body，避免把 DTO 类型当作运行时验证。
export class AgentBodyPipe implements PipeTransform<unknown, UpdateAgentDto> {
  constructor(private readonly partial = false) {}

  transform(value: unknown): CreateAgentDto | UpdateAgentDto {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('请求体必须是对象');
    }
    const body = value as Record<string, unknown>;
    const allowed = ['name', 'description', 'isPublic'];
    if (Object.keys(body).some((key) => !allowed.includes(key))) {
      throw new BadRequestException('请求体包含不支持的字段');
    }
    const result: UpdateAgentDto = {};
    if (!this.partial || Object.hasOwn(body, 'name')) {
      if (typeof body.name !== 'string' || !body.name.trim()) {
        throw new BadRequestException('name 必须是非空字符串');
      }
      result.name = body.name.trim();
    }
    if (!this.partial || Object.hasOwn(body, 'description')) {
      if (typeof body.description !== 'string') {
        throw new BadRequestException('description 必须是字符串');
      }
      result.description = body.description;
    }
    if (!this.partial || Object.hasOwn(body, 'isPublic')) {
      if (typeof body.isPublic !== 'boolean') {
        throw new BadRequestException('isPublic 必须是布尔值');
      }
      result.isPublic = body.isPublic;
    }
    return result;
  }
}
