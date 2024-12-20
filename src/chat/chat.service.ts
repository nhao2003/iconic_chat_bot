import { Injectable } from '@nestjs/common';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { FaqService } from 'src/faq/faq.service';
import { LlmService } from 'src/llm/llm.service';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class ChatService {
  private readonly productService: ProductService;
  private readonly llmService: LlmService;
  private readonly embeddingService: EmbeddingService;
  private readonly faqService: FaqService;
  constructor(
    productService: ProductService,
    llmService: LlmService,
    embeddingService: EmbeddingService,
    faqService: FaqService,
  ) {
    this.productService = productService;
    this.llmService = llmService;
    this.embeddingService = embeddingService;
    this.faqService = faqService;
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
        intent,
        answer: await this.llmService.generateResponse(prompt),
        products,
      };
    } else if (intent.intent === 'policy_faq') {
      const embedding = await this.embeddingService.embedQuestion(
        intent.entities.question,
      );
      const faqs = await this.faqService.findRelatedQuestions(embedding);

      const prompt =
        `Bạn hãy đóng vai là một tư vấn viên cho sàn thương mại điện tử. Hãy xưng em với khách hàng. Hãy giải đáp cho khách hàng câu hỏi về chính sách.` +
        `Dưới đây là thông tin về câu hỏi của khách hàng và các câu hỏi liên quan.` +
        `Bạn hãy giải đáp cho khách hàng nhé! Nếu không có câu hỏi nào phù hợp, bạn có thể đề xuất câu hỏi khác hoặc không đề xuất.` +
        `Câu hỏi của khách hàng: ${intent.entities.question}\n` +
        `Email và số điện thoại CSKH nếu cần: nhathaodev@gmail.com. Số điện thoại của tôi là: 0342841467.\n` +
        `Tài liệu bạn có thể tham khảo:\n` +
        `${faqs.map((faq, index) => `${index + 1}. Câu hỏi: ${faq.question}. Trả lời: ${faq.answer}`).join('\n')}`;
      return {
        intent,
        answer: await this.llmService.generateResponse(prompt),
        faqs,
      };
    } else if (intent.intent === 'irrelevant') {
      const prompt =
        `Bạn hãy đóng vai là một tư vấn viên cho sàn thương mại điện tử. Đây là câu hỏi không phù hợp với chủ đề.` +
        `Nếu đây là câu hỏi khác hàng thực sự đặt, bạn hãy đề xuất câu hỏi khác hoặc không đề xuất.` +
        `Nếu đây là một lời chào thì bạn hãy chào khách hàng.` +
        `Câu hỏi của khách hàng: ${text}\n` +
        `Email và số điện thoại CSKH nếu khách hàng cần: nhathaodev@gmail.com hoặc 0342841467.`;
      return {
        intent,
        answer: await this.llmService.generateResponse(prompt),
      };
    } else if (intent.intent === 'not_allowed') {
      return {
        intent,
        answer:
          'Xin lỗi, tôi không thể trả lời câu hỏi này. Bạn có thể đặt lại câu hỏi khác. Cảm ơn bạn!',
      };
    } else {
      return {
        intent,
        answer:
          'Xin lỗi, tôi không hiểu câu hỏi của bạn. Bạn có thể đặt lại câu hỏi khác. Cảm ơn bạn!',
      };
    }
  }
}
