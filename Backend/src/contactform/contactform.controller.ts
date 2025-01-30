import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ContactformService } from './contactform.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('contactform')
export class ContactformController {
    constructor(private readonly contactformService: ContactformService) {}



    @Post()
  async createContactForm(@Body() body: { name: string; email: string; subject: string; message: string }) {
    console.log('Received data:', body);
    return await this.contactformService.createContactForm(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getContactForms() {
    return await this.contactformService.getContactForms();
  }
}
