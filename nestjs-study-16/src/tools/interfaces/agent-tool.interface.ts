export interface AgentTool {
  execute(input: string): Promise<unknown>;
}
