import { Module } from '@nestjs/common';
import { FaqCategoryService } from './faq_category.service';
import { FaqCategoryController } from './faq_category.controller';

@Module({
  controllers: [FaqCategoryController],
  providers: [FaqCategoryService],
})
export class FaqCategoryModule {}
