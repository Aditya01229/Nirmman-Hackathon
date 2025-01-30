import { Module } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryService } from 'src/cloudinary.service';


@Module({
  imports:[DatabaseModule],
  controllers: [CampaignController],
  providers: [CampaignService,CloudinaryService],
})
export class CampaignModule {}
