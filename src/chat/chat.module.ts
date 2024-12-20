import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { LlmModule } from 'src/llm/llm.module';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { ProductModule } from 'src/product/product.module';
import { FaqModule } from 'src/faq/faq.module';

@Module({
  imports: [EmbeddingModule, LlmModule, ProductModule, FaqModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
