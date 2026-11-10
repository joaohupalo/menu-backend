import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MaxLength, Min } from "class-validator";

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  active?:boolean;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  picture?: string;

    @IsOptional()
    @IsBoolean()
    vegetarian?: boolean;

    @IsOptional()
    @IsBoolean()
    isNew?: boolean;
}
