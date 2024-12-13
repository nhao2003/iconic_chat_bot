import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { LlmModule } from './llm/llm.module';
import { ProductModule } from './product/product.module';
import { FaqModule } from './faq/faq.module';
import { FaqCategoryModule } from './faq_category/faq_category.module';

@Module({
  imports: [EmbeddingModule, LlmModule, ProductModule, ChatModule, FaqModule, FaqCategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
