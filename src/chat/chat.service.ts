import { Injectable } from '@nestjs/common';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { LlmService } from 'src/llm/llm.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ChatService {
  private readonly productService: ProductService;
  private readonly llmService: LlmService;
  private readonly embeddingService: EmbeddingService;

  constructor(
    productService: ProductService,
    llmService: LlmService,
    embeddingService: EmbeddingService,
  ) {
    this.productService = productService;
    this.llmService = llmService;
    this.embeddingService = embeddingService;
  }

  async getResponse(text: string): Promise<any> {
    const intent = await this.llmService.getIntent(text);
    if (intent.intent === 'product_consultation') {
      const embedding = await this.embeddingService.embedQuestion(
        intent.entities.product,
      );
      const products = await this.productService.findProducts(embedding);
      console.log(products);
      const prompt =
        `Bạn là một tư vấn viên sản phẩm ảo.` +
        `Dưới đây là 5 sản phẩm phù hợp với câu hỏi của khách hàng.` +
        `Bạn hãy tư vấn cho khách hàng nhé! Nếu không có sản phẩm phù hợp, bạn có thể đề xuất sản phẩm khác hoặc không đề xuất.` +
        `Câu hỏi của khách hàng: ${intent.entities.product}\n` +
        `Danh sách sản phẩm:\n` +
        `${products.map((product, index) => `${index + 1}. ${product.name}. Giá: ${product.price}. Mô tả: ${product.description}`).join('\n')}`;
      return {
        answer: await this.llmService.generateResponse(prompt),
        products,
      };
    } else {
      return intent;
    }
  }
}
