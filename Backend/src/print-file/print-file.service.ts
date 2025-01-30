// print-file.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreatePrintFileDto } from './dto/create-print-file.dto';
import { PrintFile } from '@prisma/client';

@Injectable()
export class PrintFileService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createPrintFileDto: CreatePrintFileDto): Promise<PrintFile> {
        return this.databaseService.printFile.create({ data: createPrintFileDto });
    }

    async findAll(): Promise<PrintFile[]> {
        return this.databaseService.printFile.findMany();
    }

    async findOne(id: number): Promise<PrintFile> {
        return this.databaseService.printFile.findUnique({ where: { id } });
    }

}
