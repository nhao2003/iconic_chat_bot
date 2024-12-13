import {
  GoogleGenerativeAI,
  SchemaType,
  ResponseSchema,
  GenerativeModel,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import PromptLibrary from 'src/core/prompt_library';

export interface Intent {
  intent: 'product_consultation' | 'policy_faq' | 'irrelevant' | 'not_allowed';
  confidence: number;
  entities: {
    product?: string;
    question?: string;
  };
}

export interface Entity {
  product?: string;
  question?: string;
}

@Injectable()
export class LlmService {
  private readonly googleGenerativeAI: GoogleGenerativeAI;
  private readonly generativeIntentModel: GenerativeModel;
  private readonly generativeResponseModel: GenerativeModel;
  private schema: ResponseSchema = {
    description: 'The schema for the response object.',
    type: SchemaType.OBJECT,
    required: ['intent', 'confidence'],
    properties: {
      intent: {
        type: SchemaType.STRING,
        description: 'Intent của câu hỏi',
        enum: [
          'product_consultation',
          'policy_faq',
          'irrelevant',
          'not_allowed',
        ],
      },
      confidence: {
        type: SchemaType.NUMBER,
        description: 'Độ chính xác của intent từ 0 đến 1',
      },
      entities: {
        type: SchemaType.OBJECT,
        nullable: true,
        description: 'Các thông tin cụ thể của intent',
        properties: {
          product: {
            type: SchemaType.STRING,
            description:
              'Chuẩn hóa tên sản phẩm, đặc điểm sản phẩm nếu intent là product_consultation. Nếu người dùng cung cấp ít thông tin, bạn có thể đưa ra gợi ý sản phẩm phù hợp. Nếu không phải câu hỏi, giữ giá trị là null',
          },
          question: {
            type: SchemaType.STRING,
            description:
              'Chuẩn hóa câu hỏi của người dùng nếu intent là policy_faq. Null nếu không phải câu hỏi',
            nullable: true,
          },
        },
      },
    },
  };

  constructor() {
    this.googleGenerativeAI = new GoogleGenerativeAI(
      process.env.GOOGLE_API_KEY as string,
    );
    this.generativeIntentModel = this.googleGenerativeAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: this.schema,
      },
    });

    this.generativeResponseModel = this.googleGenerativeAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }

  private promptLibrary = new PromptLibrary();
  async getIntent(input: string): Promise<Intent> {
    const reponse = await this.generativeIntentModel.generateContent(
      this.promptLibrary.intentClassificationPrompt(input),
    );
    console.log(this.promptLibrary.intentClassificationPrompt(input));
    console.log(reponse.response.text());
    return JSON.parse(reponse.response.text());
  }

  async generateResponse(text: string): Promise<string> {
    const reposne = await this.generativeResponseModel.generateContent(text);
    return reposne.response.text();
  }
}
