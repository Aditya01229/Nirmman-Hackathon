import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './user_dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createUserDto: CreateUserDto) {
        if (createUserDto.password !== createUserDto.confirmpassword) {
            throw new BadRequestException('Passwords do not match');
        }

        const hashpass = await bcrypt.hash(createUserDto.password, 10);
       
        let data: Prisma.UserCreateInput = {
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashpass,
            role: 'USER',
        };

        try {
            return await this.databaseService.user.create({ data });
        } catch (error) {
            throw new BadRequestException("Failed to create User: " + error.message);
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.databaseService.user.findUnique({ where: { email } });
  
            if (!user) {
                throw new UnauthorizedException('Invalid email');
            }
  
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }
  
            return user;
        } catch (error) {
            throw new UnauthorizedException('Login failed: ' + error.message);
        }
    }

    async adminLogin(email: string, password: string) {
        try {
            const user = await this.databaseService.user.findUnique({ where: { email } });
  
            if (!user) {
                throw new UnauthorizedException('Invalid email');
            }
  
            if (user.role !== 'ADMIN') {
                throw new UnauthorizedException('Unauthorized access');
            }
  
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }
  
            return user;
        } catch (error) {
            throw new UnauthorizedException('Admin login failed: ' + error.message);
        }
    }


    async getAllUsers() {
        return await this.databaseService.user.findMany(); 
      }
    
      async deleteUser(id: string) {
        const userId = parseInt(id, 10); 
        const user = await this.databaseService.user.findUnique({ where: { id: userId } });
      
        if (!user) {
          throw new NotFoundException('User not found');
        }
      
        return await this.databaseService.user.delete({ where: { id: userId } });
      }
    }
