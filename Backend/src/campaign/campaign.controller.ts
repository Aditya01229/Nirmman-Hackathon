import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CloudinaryService } from '../cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('admin/campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService,private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('photo'))
  async create(@Request() req,@UploadedFile() file: Express.Multer.File, @Body() createCampaignDto: CreateCampaignDto) {
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access restricted to admins');
    }
    if (!file) {
      throw new BadRequestException('Photo must be provided');
    }
    const photoUrl = await this.cloudinaryService.uploadImage(file);
    return this.campaignService.create({
      ...createCampaignDto,
      photo: photoUrl, // Use the URL returned by Cloudinary
    });
  }

  @Get('getallcampaign')
  findAll() {
    return this.campaignService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
@Patch(':id')
@UseInterceptors(FileInterceptor('photo'))  // Intercept file upload for the 'photo' field
async update(
  @Request() req, 
  @Param('id') id: string, 
  @UploadedFile() file: Express.Multer.File,  // Handle the uploaded file
  @Body() updateCampaignDto: UpdateCampaignDto
) {
  if (req.user.role !== 'ADMIN') {
    throw new UnauthorizedException('Access restricted to admins');
  }

  let photoUrl: string | undefined;
  if (file) {
    // If a new photo is provided, upload it to Cloudinary
    photoUrl = await this.cloudinaryService.uploadImage(file);
  }

  // Merge the updateCampaignDto with the new photo URL if it's provided
  const updatedData = {
    ...updateCampaignDto,
    ...(photoUrl && { photo: photoUrl }),  // Only update the photo if a new one is uploaded
  };

  return this.campaignService.update(+id, updatedData);
}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access restricted to admins');
    }
    return this.campaignService.remove(+id);
  }
}
