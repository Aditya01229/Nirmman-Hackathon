import { Module } from '@nestjs/common';
import { AboutusController } from './aboutus.controller';
import { AboutusService } from './aboutus.service';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryService } from 'src/cloudinary.service';

@Module({
  imports:[DatabaseModule],
  controllers: [AboutusController],
  providers: [AboutusService,CloudinaryService]
})
export class AboutusModule {}
