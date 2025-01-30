import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAboutDto } from './dto/create-aboutus.dto';
import { Prisma } from '@prisma/client';
import { UpdateAboutDto } from './dto/update-aboutus.dto';

@Injectable()
export class AboutusService {
    constructor(private readonly databaseService: DatabaseService) {
    
    }

    async create(createAboutDto:CreateAboutDto){
        try {
            let data: Prisma.AboutUsCreateInput={
                title:createAboutDto.title,
                description:createAboutDto.description,
                image:createAboutDto.image
            }
            return this.databaseService.aboutUs.create({data})
        } catch (error) {
            return error
        }
    }

    async update(id:number, updateAboutDto:UpdateAboutDto){
        try {
            const existingAboutUs = await this.databaseService.aboutUs.findUnique({ where: { id } });
    if (!existingAboutUs) {
      throw new Error(`About Us section with ID ${id} not found`);
    }
    
    return this.databaseService.aboutUs.update({
      where: { id },
      data: {
        ...updateAboutDto,
        // Retain the existing image if no new image is provided
        image: updateAboutDto.image || existingAboutUs.image,
    },
    });
        } catch (error) {
            return {
                message: 'Could not Update details'
            }
        }
    }

    async findOne(id:string) {
        const aboutUs = await this.databaseService.aboutUs.findUnique({
            where: { id: Number(id) },
        });
        if (!aboutUs) {
          throw new Error('About Us section not found');
        }
        return aboutUs;
      }

}
