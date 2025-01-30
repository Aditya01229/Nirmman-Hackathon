import { Injectable } from '@nestjs/common';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { DatabaseService } from 'src/database/database.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CampaignService {
  constructor(private readonly databaseService: DatabaseService) {
    
  }
  async create(createCampaignDto: CreateCampaignDto) {
    try {
      let data: Prisma.CampaignCreateInput={
        title:createCampaignDto.title,
        description:createCampaignDto.description,
        photo:createCampaignDto.photo,
        amountToBeRaised: Number(createCampaignDto.amountToBeRaised)
      }
   
    return this.databaseService.campaign.create({data});
    } 
    catch (error) {
      return error
    }
  }

  async findAll() {
    return this.databaseService.campaign.findMany();
  }

  async findOne(id: number) {
    return await this.databaseService.campaign.findFirst({
      where:{
        id:id
      }
    });
  }

  async update(id: number, updateCampaignDto: UpdateCampaignDto) {
    try {
      const existingCampaign = await this.databaseService.campaign.findUnique({
        where: { id: id },
      });
  
      if (!existingCampaign) {
        return { message: `Campaign with ID ${id} not found.` };
      }
      return await this.databaseService.campaign.update({
        where: { id: id },
        data: {
          ...updateCampaignDto,
          amountToBeRaised: updateCampaignDto.amountToBeRaised ? Number(updateCampaignDto.amountToBeRaised) : existingCampaign.amountToBeRaised,
        },
      });
    } catch (error) {
      return { message: 'An error occurred during the update', error: error.message };
    }
  }

  async remove(id: number) {
    try {
      const existingCampaign = await this.databaseService.campaign.findUnique({
        where: { id: id },
      });
  
      if (!existingCampaign) {
        return { message: `Campaign with ID ${id} not found.` };
      }

      await this.databaseService.campaign.delete({
        where: { id: id },
      });
  
      return { message: `Campaign with ID ${id} has been successfully deleted.` };
    } catch (error) {
      return { message: 'An error occurred during the deletion', error: error.message };
    }
  }
  
}
