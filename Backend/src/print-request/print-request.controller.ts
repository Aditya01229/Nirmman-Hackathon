import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { PrintRequestService } from './print-request.service';
import { CreatePrintRequestDto } from './dto/create-print-request.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../multer.config';
import { AddPrintFilesDto } from './dto/add-print-files.dto';

@Controller('print-request')
export class PrintRequestController {
  constructor(private readonly printRequestService: PrintRequestService) {}

  // ✅ Create a new Print Request
  @Post('newrequest/:id')
  async createPrintRequest(
    @Param('id', ParseIntPipe) shopId: number,
    @Body() data: CreatePrintRequestDto) {
    return await this.printRequestService.createPrintRequest(data, shopId);
  }

  // ✅ Upload files for an existing Print Request
  @Post('uploadfiles/:id')
@UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }], multerOptions))
async addPrintFiles(
  @Param('id', ParseIntPipe) printRequestId: number,
  @UploadedFiles() files: { files?: Express.Multer.File[] }, // Changed to match the structure
  @Body() fileDetails: AddPrintFilesDto[],
) {
  // Check if files exist and are in the expected format
  const uploadedFiles = files.files || []; // Get the 'files' field or default to an empty array
  return await this.printRequestService.addPrintFiles(printRequestId, uploadedFiles, fileDetails);
}

  // ✅ Get all Print Requests
  @Get()
  async getAllPrintRequests() {
    return await this.printRequestService.getAllPrintRequests();
  }

  // ✅ Get a single Print Request
  @Get(':id')
  async getPrintRequestById(@Param('id', ParseIntPipe) id: number) {
    return await this.printRequestService.getPrintRequestById(id);
  }
}
