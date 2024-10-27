import { IsString, IsUrl, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUrl()
  clientUrl?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];
}