// print-file.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { PrintFileService } from './print-file.service';
import { CreatePrintFileDto } from './dto/create-print-file.dto';
import { PrintFile } from '@prisma/client';

@Controller('print-files')
export class PrintFileController {
    constructor(private readonly printFileService: PrintFileService) {}

    @Post()
    async create(@Body() createPrintFileDto: CreatePrintFileDto): Promise<PrintFile> {
        return this.printFileService.create(createPrintFileDto);
    }

    @Get()
    async findAll(): Promise<PrintFile[]> {
        return this.printFileService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<PrintFile> {
        return this.printFileService.findOne(id);
    }

    
}
