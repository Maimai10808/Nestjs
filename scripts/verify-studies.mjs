import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const studies = readdirSync(root, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^nestjs-study-\d+$/.test(entry.name))
  .map((entry) => Number(entry.name.slice('nestjs-study-'.length)))
  .sort((a, b) => a - b);
const requested = process.argv.slice(2);
if (requested.some((value) => !/^\d+$/.test(value) || !studies.includes(Number(value)))) {
  console.error(`请输入实际存在的 Study 编号：${studies.join(', ')}`);
  process.exit(1);
}
const selected = requested.length ? [...new Set(requested.map(Number))] : studies;
const checks = [
  ['构建', ['build']],
  ['完整类型检查', ['exec', 'tsc', '--noEmit', '--incremental', 'false']],
  ['lint', ['lint']],
  ['单元测试', ['test']],
  // 上面已经构建；直接执行 Vitest，避免 test:e2e 脚本重复构建。
  ['HTTP e2e', ['exec', 'vitest', 'run', '--config', 'vitest.config.e2e.ts']],
];
const failures = [];
for (const number of selected) {
  for (const [label, args] of checks) {
    console.log(`\nStudy ${number} · ${label}`);
    const result = spawnSync('pnpm', args, {
      cwd: join(root, `nestjs-study-${number}`),
      stdio: 'inherit',
    });
    if (result.status !== 0) {
      failures.push(`Study ${number} · ${label}`);
      if (result.error) console.error(result.error.message);
      // 构建失败时不继续读取可能已过期的 dist。
      if (label === '构建') break;
    }
  }
}
if (failures.length) {
  console.error(`\n检查失败：\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`\n全部通过：${selected.length} 个 Study`);
}
