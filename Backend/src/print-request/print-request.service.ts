import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePrintRequestDto } from './dto/create-print-request.dto';
import { AddPrintFilesDto } from './dto/add-print-files.dto';

@Injectable()
export class PrintRequestService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ✅ Create a Print Request
  async createPrintRequest(data: CreatePrintRequestDto, shopId: number) {
    const requestData = { ...data, shopId }; // Merge data with shopId

  return await this.databaseService.printRequest.create({
    data: requestData, // Use requestData here
  });
  }

  // ✅ Upload Print Files for an existing Print Request
  async addPrintFiles(printRequestId: number, files: Express.Multer.File[], fileDetails: AddPrintFilesDto[]) {
    const uploadedFiles = files.map((file, index) => ({
      cloud_address: file.path, // Cloudinary URL
      copies: fileDetails[index]?.copies || 1,
      color: fileDetails[index]?.color || false,
      front_back: fileDetails[index]?.front_back || false,
      printRequestId,
    }));

    return await this.databaseService.printFile.createMany({ data: uploadedFiles });
  }

  // ✅ Get all Print Requests with related files
  async getAllPrintRequests() {
    return await this.databaseService.printRequest.findMany({
      include: { printFiles: true },
    });
  }

  // ✅ Get a Print Request by ID with related files
  async getPrintRequestById(id: number) {
    const request = await this.databaseService.printRequest.findUnique({
      where: { id },
      include: { printFiles: true },
    });

    if (!request) throw new NotFoundException('Print request not found');

    return request;
  }
}
