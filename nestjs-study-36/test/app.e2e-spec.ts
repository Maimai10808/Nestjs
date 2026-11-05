import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../dist/app.module.js';
import { ReportsService } from '../dist/reports/reports.service.js';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { fileURLToPath } from 'node:url';
import { startRuntime } from './runtime.js';

describe('MVC views and build assets', () => {
  let runtime: Awaited<ReturnType<typeof startRuntime>>;
  beforeAll(async () => {
    runtime = await startRuntime();
  });
  afterAll(async () => {
    await runtime?.stop();
  });
  it('renders HTML, print layout, JSON, CSS from a foreign working directory', async () => {
    await request(runtime.url)
      .get('/')
      .expect(200)
      .expect('content-type', /html/)
      .expect((res) => expect(res.text).toContain('AI Deep Research Platform'));
    await request(runtime.url)
      .get('/reports')
      .expect(200)
      .expect((res) => expect(res.text).toContain('LangGraph 技术研究报告'));
    await request(runtime.url)
      .get('/reports/1')
      .expect(200)
      .expect((res) => expect(res.text).toContain('/css/style.css'));
    await request(runtime.url)
      .get('/reports/1/print')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('打印');
        expect(res.text).not.toContain('/css/style.css');
      });
    await request(runtime.url)
      .get('/reports/1/raw')
      .expect(200)
      .expect('content-type', /json/);
    await request(runtime.url)
      .get('/css/style.css')
      .expect(200)
      .expect('content-type', /css/);
    await request(runtime.url).get('/reports/no').expect(400);
    await request(runtime.url).get('/reports/999').expect(404);
  });
  it('selects the generating template from report state', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = module.createNestApplication<NestExpressApplication>();
    const reports = app.get(ReportsService);
    reports.findOne(1).status = 'generating';
    app.setBaseViewsDir(
      fileURLToPath(new URL('../dist/views', import.meta.url)),
    );
    app.setViewEngine('hbs');
    app.setLocal('layout', 'layouts/app');
    await app.init();
    try {
      await request(app.getHttpServer())
        .get('/reports/1/preview')
        .expect(200)
        .expect((res) => expect(res.text).toContain('AI Agent 正在生成报告'));
    } finally {
      await app.close();
    }
  });
});
