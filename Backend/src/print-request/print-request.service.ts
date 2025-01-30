import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreatePrintRequestDto } from './dto/create-print-request.dto';
import { AddPrintFilesDto } from './dto/add-print-files.dto';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios'; // Import axios

@Injectable()
export class PrintRequestService {
  constructor(private readonly databaseService: DatabaseService) {}

  // ✅ Create a Print Request
  async createPrintRequest(data: CreatePrintRequestDto, shopId: number) {
    const requestData = { ...data, shopId };

    return await this.databaseService.printRequest.create({
      data: requestData,
    });
  }

  // ✅ Upload a Print File for an existing Print Request
  async addPrintFile(printRequestId: number, file: Express.Multer.File, fileDetails: AddPrintFilesDto) {
    console.log(fileDetails);

    // Get the number of pages
    const pages = await this.getPdfPageCount(file.path); 
    const colorString = fileDetails.color;
    const frontBackString = fileDetails.front_back;

    const color = fileDetails.color === 'true';
    const front_back = fileDetails.front_back === 'true';

    console.log(pages, color, front_back);
    
    // Calculate the amount for the new file based on the provided logic
    let newFileAmount = 0;

    if (color) {
        newFileAmount += (pages * 5);
    } else {
        newFileAmount += (pages * 2);
    }

    if (front_back) {
        newFileAmount /= 2;
    }

    newFileAmount*=fileDetails.copies;
    // Retrieve the existing print request to get the total amount so far
    const existingPrintRequest = await this.databaseService.printRequest.findUnique({
        where: { id: printRequestId },
        include: { printFiles: true }, // Include related print files
    });

    if (!existingPrintRequest) {
        throw new NotFoundException('Print request not found');
    }

    // Calculate the current total amount
    const currentTotalAmount = existingPrintRequest.printFiles.reduce((total, file) => {
        return total + (file.amount || 0); // Accumulate the amounts for each file
    }, 0);

    // Update the total amount including the new file
    const updatedTotalAmount = currentTotalAmount + newFileAmount;

    // Save the uploaded file along with the calculated amount
    await this.databaseService.printFile.create({
        data: {
            cloud_address: file.path, // Cloudinary URL
            copies: parseInt(fileDetails.copies.toString() || '1', 10), // Convert copies to integer
            color: colorString,
            front_back: frontBackString,
            printRequestId,
            amount: newFileAmount, // Store the calculated amount for the new file
        },
    });

    // Optionally update the total amount in the print request if you have a field for that
    // await this.databaseService.printRequest.update({
    //     where: { id: printRequestId },
    //     data: { totalAmount: updatedTotalAmount }, // Assuming there's a totalAmount field
    // });

    return updatedTotalAmount; // Return the updated total amount
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

  // ✅ Get the number of pages in a PDF from the cloud address
  async getPdfPageCount(cloudAddress: string): Promise<number> {
    const response = await axios.get(cloudAddress, { responseType: 'arraybuffer' });
    const pdfData = response.data;
    const pdfDoc = await PDFDocument.load(pdfData);
    return pdfDoc.getPageCount();
  }
}
