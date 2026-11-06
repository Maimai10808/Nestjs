import {
  Controller,
  Get,
  Render,
} from '@nestjs/common';

@Controller('security')
export class SecurityController {
  // 1. 普通 JSON 接口
  @Get('headers')
  getHeaders() {
    return {
      message:
        '请通过 curl -I 或浏览器开发者工具查看响应头',

      securityHeaders: [
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'Referrer-Policy',
        'Strict-Transport-Security',
      ],
    };
  }

  // 2. CSP 教学接口
  @Get('csp-demo')
  @Render('index')
  cspDemo() {
    return {
      title: 'CSP Security Demo',

      description:
        '观察 Content-Security-Policy 如何限制页面资源加载',
    };
  }

  // 3. iframe 防护接口
  @Get('frame-demo')
  @Render('index')
  frameDemo() {
    return {
      title: 'Frame Protection Demo',

      description:
        '观察 X-Frame-Options 和 frame-ancestors',
    };
  }
}
