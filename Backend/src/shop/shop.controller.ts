import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AboutusService } from './shop.service';
import { CreateAboutDto } from './dto/create-shop.dto';
import { UpdateAboutDto } from './dto/update-shop.dto';
import { LoginDto } from './dto/login-shop.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserId } from './common/decorator/user-id.decorator';


@Controller('shop')
export class AboutusController {
    constructor(private readonly aboutusService: AboutusService) {}


    @Post('login')
    async login(
        @Body() loginData:LoginDto
    ){
        return this.aboutusService.login(loginData);
    }

    @Post('shopentry')
    async create(
        @Body() createAboutDto: CreateAboutDto,
    ) {
        return this.aboutusService.create(createAboutDto);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAboutUsDto: UpdateAboutDto,
    ) {
        return this.aboutusService.update(+id, updateAboutUsDto);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get('getshop')
    async findOne(@UserId() id: number) {
        return this.aboutusService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('getqueue')
    async getQueue(@UserId() id: number) {
        return this.aboutusService.getQueue(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('markcomplete/:id')
    async markComplete(@UserId() id: number, @Param('id') queueId: number) {
        return this.aboutusService.markComplete(id, queueId);
    }

    @Patch('markpaid/:id')
    async markPaid(@Param('id') queueId: number) {
        return this.aboutusService.markPaid(queueId);
    }
}

