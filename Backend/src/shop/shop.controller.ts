import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AboutusService } from './shop.service';
import { CreateAboutDto } from './dto/create-shop.dto';
import { UpdateAboutDto } from './dto/update-shop.dto';
import { LoginDto } from './dto/login-shop.dto';


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

    @Get('getshop/:id')
    async findOne(@Param('id') id: string) {
        return this.aboutusService.findOne(id);
    }

    
}

