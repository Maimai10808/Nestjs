import type {} from 'multer';
import {
  mkdtemp,
  open,
  readFile,
  readdir,
  rm,
  writeFile,
  mkdir,
} from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Readable } from 'node:stream';
import { KnowledgeService } from './knowledge.service.js';

vi.mock('node:crypto', () => ({ randomUUID: () => 'fixture-file' }));

function file(): Express.Multer.File {
  const buffer = Buffer.from('notes');
  return {
    fieldname: 'file',
    originalname: 'notes.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    size: buffer.length,
    buffer,
    stream: Readable.from(buffer),
    destination: '',
    filename: '',
    path: '',
  };
}

describe('文件写入失败不留下错误元数据或破坏已有文件', () => {
  let cwd: string;
  beforeEach(async () => {
    cwd = await mkdtemp(join(tmpdir(), 'knowledge-write-'));
    vi.spyOn(process, 'cwd').mockReturnValue(cwd);
  });
  afterEach(async () => {
    vi.restoreAllMocks();
    await rm(cwd, { recursive: true, force: true });
  });
  it('同名文件已存在时保留原始内容', async () => {
    await mkdir(join(cwd, 'uploads'));
    const existing = join(cwd, 'uploads/fixture-file.txt');
    await writeFile(existing, 'existing bytes');
    const service = new KnowledgeService();
    await expect(
      service.saveFile(file(), { agentId: 1 }),
    ).rejects.toMatchObject({ code: 'EEXIST' });
    expect(await readFile(existing, 'utf8')).toBe('existing bytes');
    expect(service.findAll()).toEqual([]);
  });
  it('已创建文件在写入失败时移除', async () => {
    const probe = await open(join(cwd, 'probe'), 'wx');
    const prototype = Object.getPrototypeOf(probe) as typeof probe;
    await probe.close();
    vi.spyOn(prototype, 'writeFile').mockRejectedValueOnce(
      new Error('simulated disk failure'),
    );
    const service = new KnowledgeService();
    await expect(service.saveFile(file(), { agentId: 1 })).rejects.toThrow(
      'simulated disk failure',
    );
    expect(await readdir(join(cwd, 'uploads'))).toEqual([]);
    expect(service.findAll()).toEqual([]);
  });
});
