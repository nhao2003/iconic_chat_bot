import { Test, TestingModule } from '@nestjs/testing';
import { FaqCategoryService } from './faq_category.service';

describe('FaqCategoryService', () => {
  let service: FaqCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaqCategoryService],
    }).compile();

    service = module.get<FaqCategoryService>(FaqCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
