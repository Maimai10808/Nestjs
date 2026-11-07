import { Module } from '@nestjs/common';

import {
  ClientsModule,
  Transport,
} from '@nestjs/microservices';

import { ResearchController } from './research.controller.js';

import { ResearchService } from './research.service.js';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AGENT_WORKER',

        transport: Transport.TCP,

        options: {
          host: '127.0.0.1',

          port: 4001,
        },
      },
    ]),
  ],

  controllers: [
    ResearchController,
  ],

  providers: [
    ResearchService,
  ],
})
export class ResearchModule {}
