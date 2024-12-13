import { Test, TestingModule } from '@nestjs/testing';
import { FaqCategoryController } from './faq_category.controller';
import { FaqCategoryService } from './faq_category.service';

describe('FaqCategoryController', () => {
  let controller: FaqCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaqCategoryController],
      providers: [FaqCategoryService],
    }).compile();

    controller = module.get<FaqCategoryController>(FaqCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
