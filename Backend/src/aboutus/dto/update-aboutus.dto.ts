import { PartialType } from "@nestjs/mapped-types";
import { CreateAboutDto } from "./create-aboutus.dto";

export class UpdateAboutDto extends PartialType(CreateAboutDto){}