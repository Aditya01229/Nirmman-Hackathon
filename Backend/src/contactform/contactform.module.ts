import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ContactformController } from './contactform.controller';
import { ContactformService } from './contactform.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports:[DatabaseModule],
    controllers:[ContactformController],
    providers:[ContactformService]
})
export class ContactformModule {}
