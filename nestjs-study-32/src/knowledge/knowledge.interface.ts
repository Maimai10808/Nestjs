export interface KnowledgeFile {
  id: number;

  agentId: number;

  originalName: string;

  storedName: string;

  mimeType: string;

  size: number;

  path: string;

  description?: string;

  uploadedAt: string;
}
