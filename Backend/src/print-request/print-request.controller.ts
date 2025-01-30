import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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

  // ✅ Upload a file for an existing Print Request
  @Post('uploadfiles/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 1 }], multerOptions)) // Change maxCount to 1
  async addPrintFile(
    @Param('id', ParseIntPipe) printRequestId: number,
    @UploadedFiles() files: { files?: Express.Multer.File[] }, // Get the 'files' field or default to an empty array
    @Body() fileDetails: AddPrintFilesDto,
  ) {
    // Check if a file exists
    const uploadedFile = files.files ? files.files[0] : null; // Get the first uploaded file

    if (!uploadedFile) {
      throw new NotFoundException('No file uploaded'); // Handle the case where no file is uploaded
    }

    // Optional: Log the received file details for debugging
    console.log('Uploaded File:', uploadedFile);
    console.log('File Details:', fileDetails);

    return await this.printRequestService.addPrintFile(printRequestId, uploadedFile, fileDetails);
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
