// print-file.module.ts
import { Module } from '@nestjs/common';
import { PrintFileController } from './print-file.controller';
import { PrintFileService } from './print-file.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
    controllers: [PrintFileController],
    providers: [PrintFileService, DatabaseService],
})
export class PrintFileModule {}
