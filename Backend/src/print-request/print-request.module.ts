import { Module } from '@nestjs/common';
import { PrintRequestController } from './print-request.controller';
import { PrintRequestService } from './print-request.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [PrintRequestController],
  providers: [PrintRequestService, DatabaseService],
})
export class PrintRequestModule {}
