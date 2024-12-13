import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { ObjectId } from 'mongodb';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Post()
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.create(createFaqDto);
  }

  @Get()
  findAll(
    @Param('limit') limit: number,
    @Param('offset') offset: number,
    @Param('category_id') category_id: string | null,
  ) {
    const categoryId = category_id ? new ObjectId(category_id) : null;
    limit = limit > 0 && limit < 100 ? limit : 10;
    offset = offset > 0 ? offset : 0;
    return this.faqService.findAll(limit, offset, categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.faqService.findOne(new ObjectId(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.update(new ObjectId(id), updateFaqDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.faqService.remove(new ObjectId(id));
  }
}
