import { Module } from '@nestjs/common';
import { AboutusController } from './shop.controller';
import { AboutusService } from './shop.service';
import { DatabaseModule } from 'src/database/database.module';
import { CloudinaryService } from 'src/cloudinary.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './auth.guard';

@Module({
  imports:[DatabaseModule,PassportModule,JwtModule.register({
    secret:'Secret',
    signOptions:{
    expiresIn:'1h'
    }
  })
],
  controllers: [AboutusController],
  providers: [AboutusService,CloudinaryService,JwtStrategy,JwtAuthGuard]
})
export class AboutusModule {}
