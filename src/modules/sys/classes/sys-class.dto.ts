import { IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf} from "class-validator";

export class UpdateSysClassDTO {
    @IsNotEmpty()
    id!: number;

    @ValidateIf(dto => dto.description === null || dto.description === undefined)
    @IsNotEmpty({ message: "uniqueCode or description is required" })
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    uniqueCode?: string;
    
    @ValidateIf(dto => dto.uniqueCode === null || dto.uniqueCode === undefined)
    @IsNotEmpty({ message: "uniqueCode or description is required" })
    @IsString()
    @MaxLength(50)
    @MinLength(3)
    description?: string;
}


export class CreateSysClassDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    uniqueCode!: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @MinLength(3)
    description!: string;
}

export type SaveSysClassDTO = CreateSysClassDTO | UpdateSysClassDTO;