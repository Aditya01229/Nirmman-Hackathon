    import { PartialType } from "@nestjs/mapped-types";
    import { CreateAboutDto } from "./create-shop.dto";

    export class UpdateAboutDto extends PartialType(CreateAboutDto){}