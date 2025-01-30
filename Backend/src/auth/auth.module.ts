import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth-guard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[DatabaseModule,PassportModule,forwardRef(() => UsersModule),JwtModule.registerAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>{
      return{
        secret:config.get<string>('JWT_SECRET'),
        signOptions:{
          expiresIn: config.get<string | number>('JWT_EXPIRE')
        }
      }
    }
  }
  )],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,JwtAuthGuard],
  exports:[AuthService]
})
export class AuthModule {}
