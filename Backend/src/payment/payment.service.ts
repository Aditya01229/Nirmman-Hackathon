import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/payment.dto';
import * as crypto from 'crypto';
import { PaymentConfig } from './payment.config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  async createOrder(createOrderDto: CreateOrderDto) {
    const orderId = uuidv4();

    const paymentPayload = {
      merchantId: PaymentConfig.MERCHANT_ID,
      merchantUserId: createOrderDto.name,
      mobileNumber: createOrderDto.mobileNumber,
      amount: createOrderDto.amount * 100,
      merchantTransactionId: orderId,
      redirectUrl: `${PaymentConfig.REDIRECT_URL}/${createOrderDto.request_id}`, // ✅ Fixed template string
      redirectMode: 'POST',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };

    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
    const keyIndex = 1;
    const string = payload + '/pg/v1/pay' + PaymentConfig.MERCHANT_KEY;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${keyIndex}`;

    try {
      const response = await axios.post(
        PaymentConfig.MERCHANT_BASE_URL,
        { request: payload },
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum
          }
        }
      );

      return {
        msg: 'OK',
        url: response.data.data.instrumentResponse.redirectInfo.url
      };
    } catch (error) {
      console.error('Payment initiation failed:', error.response?.data || error.message);
      throw new Error('Failed to initiate payment');
    }
  }

  async checkStatus(merchantTransactionId: string) {
    const keyIndex = 1;
    const string = `/pg/v1/status/${PaymentConfig.MERCHANT_ID}/${merchantTransactionId}` + PaymentConfig.MERCHANT_KEY; // ✅ Fixed concatenation
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = `${sha256}###${keyIndex}`;

    try {
      const response = await axios.get(
        `${PaymentConfig.MERCHANT_STATUS_URL}/${PaymentConfig.MERCHANT_ID}/${merchantTransactionId}`, // ✅ Fixed template string
        {
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': PaymentConfig.MERCHANT_ID
          }
        }
      );

      return response.data.success ? 
        PaymentConfig.SUCCESS_URL : 
        PaymentConfig.FAILURE_URL;
    } catch (error) {
      console.error('Payment status check failed:', error.response?.data || error.message);
      throw new Error('Failed to check payment status');
    }
  }
}
