import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SchedulesService } from './schedules.service.js';
import { CreateCronDto } from './dto/create-cron.dto.js';
import { CreateDelayedDto } from './dto/create-delayed.dto.js';

@Controller('schedules')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('cron')
  createCron(@Body() dto: CreateCronDto) {
    return this.schedulesService.createCron(dto);
  }

  @Get('cron')
  findCrons() {
    return this.schedulesService.findAllCrons();
  }

  @Post('cron/:name/pause')
  pause(@Param('name') name: string) {
    return this.schedulesService.pauseCron(name);
  }

  @Post('cron/:name/resume')
  resume(@Param('name') name: string) {
    return this.schedulesService.resumeCron(name);
  }

  @Delete('cron/:name')
  remove(@Param('name') name: string) {
    return this.schedulesService.deleteCron(name);
  }

  @Post('delayed')
  createDelayed(@Body() dto: CreateDelayedDto) {
    return this.schedulesService.createDelayed(dto);
  }

  @Get('intervals')
  findIntervals() {
    return this.schedulesService.findAllIntervals();
  }

  @Get('timeouts')
  findTimeouts() {
    return this.schedulesService.findAllTimeouts();
  }
}
