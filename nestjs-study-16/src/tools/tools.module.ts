import { Module } from '@nestjs/common';

import { DiscoveryModule } from '@nestjs/core';

import { ToolRegistryService } from './tool-registry.service.js';

import { SearchTool } from './implementations/search.tool.js';
import { CalculatorTool } from './implementations/calculator.tool.js';
import { WeatherTool } from './implementations/weather.tool.js';

@Module({
  imports: [DiscoveryModule],

  providers: [
    ToolRegistryService,
    SearchTool,
    CalculatorTool,
    WeatherTool,
  ],

  exports: [ToolRegistryService],
})
export class ToolsModule {}
