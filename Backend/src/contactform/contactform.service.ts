import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ContactformService {
        constructor(private readonly databaseService: DatabaseService) {
        
        }

        async createContactForm(data: { name: string; email: string; subject: string; message: string }) {
            return await this.databaseService.contactform.create({ data });
          }
          
          
          async getContactForms() {
            return await this.databaseService.contactform.findMany();
          }
        
}
