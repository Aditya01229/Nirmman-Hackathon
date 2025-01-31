// payment.controller.ts
import { Controller, Post, Body, Query, Redirect } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreateOrderDto } from './dto/payment.dto';

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-order')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.paymentService.createOrder(createOrderDto);
  }

  @Post('status')
  @Redirect()
  async checkStatus(@Query('id') merchantTransactionId: string) {
    const url = await this.paymentService.checkStatus(merchantTransactionId);
    return { url };
  }
}

