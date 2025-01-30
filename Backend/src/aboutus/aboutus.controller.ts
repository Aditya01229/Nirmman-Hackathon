import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Request, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AboutusService } from './aboutus.service';
import { CreateAboutDto } from './dto/create-aboutus.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UpdateAboutDto } from './dto/update-aboutus.dto';
import { CloudinaryService } from 'src/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('aboutus')
export class AboutusController {
    constructor(private readonly aboutusService:AboutusService,private readonly cloudinaryService: CloudinaryService){}

    @UseGuards(JwtAuthGuard)
    @Post('createaboutus')
    @UseInterceptors(FileInterceptor('image'))
    async create(@Request() req,  @UploadedFile() file: Express.Multer.File, @Body() createAboutDto:CreateAboutDto){
        if (req.user.role !== 'ADMIN') {
            throw new UnauthorizedException('Access restricted to admins');
          }
          if (!file) {
            throw new BadRequestException('Image must be provided');
        }

        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return this.aboutusService.create({
          ...createAboutDto,
          image: imageUrl, 
      });
    }



@UseGuards(JwtAuthGuard)
@Patch(':id')
@UseInterceptors(FileInterceptor('image'))
async update(@Request() req, @Param('id') id: string,@UploadedFile() file: Express.Multer.File, @Body() updateAboutUsDto: UpdateAboutDto) {
  if (req.user.role !== 'ADMIN') {
    throw new UnauthorizedException('Access restricted to admins');
  }
  let imageUrl: string | undefined;
        if (file) {
            imageUrl = await this.cloudinaryService.uploadImage(file);
        }
        const updatedData = {
            ...updateAboutUsDto,
            ...(imageUrl && { image: imageUrl }),  // Only update the image if a new one is uploaded
        };
  return this.aboutusService.update(+id, updatedData);
}

@Get('getaboutus/:id')
async findOne(@Param('id') id: string) {
  return this.aboutusService.findOne(id);
}




}
