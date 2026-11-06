import type {
  AppAbility,
} from './casl-ability.factory.js';

// 第一种：对象形式
export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

// 第二种：函数形式
export type PolicyHandlerCallback = (
  ability: AppAbility,
) => boolean;

// 允许两种形式
export type PolicyHandler =
  | IPolicyHandler
  | PolicyHandlerCallback;
