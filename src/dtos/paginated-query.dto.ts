import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class PaginationQueryDTO {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => value ? parseInt(value) : 1)
    page!: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => value ? parseInt(value) : 10)
    limit!: number;
}