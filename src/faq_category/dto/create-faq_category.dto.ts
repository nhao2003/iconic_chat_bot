import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
