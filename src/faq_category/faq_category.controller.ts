import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaqCategoryService } from './faq_category.service';
import { CreateFaqCategoryDto } from './dto/create-faq_category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq_category.dto';
import { ObjectId } from 'mongodb';

class Pagination {
  limit: number;
  offset: number;
}

@Controller('faq-category')
export class FaqCategoryController {
  constructor(private readonly faqCategoryService: FaqCategoryService) {}

  @Post()
  create(@Body() createFaqCategoryDto: CreateFaqCategoryDto) {
    return this.faqCategoryService.create(createFaqCategoryDto);
  }

  @Get()
  findAll(query: Pagination) {
    const limit = query.limit > 0 && query.limit < 100 ? query.limit : 10;
    const offset = query.offset > 0 ? query.offset : 0;
    return this.faqCategoryService.findAll(limit, offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqCategoryService.findOne(new ObjectId(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFaqCategoryDto: UpdateFaqCategoryDto,
  ) {
    return this.faqCategoryService.update(
      new ObjectId(id),
      updateFaqCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqCategoryService.remove(new ObjectId(id));
  }
}
