import {
  EmbedContentRequest,
  GenerativeModel,
  GoogleGenerativeAI,
  TaskType,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private readonly googleGenerativeAI: GoogleGenerativeAI;
  private readonly generativeModel: GenerativeModel;

  constructor() {
    this.googleGenerativeAI = new GoogleGenerativeAI(
      process.env.GOOGLE_API_KEY,
    );
    this.generativeModel = this.googleGenerativeAI.getGenerativeModel({
      model: 'text-embedding-004',
    });
  }

  public async embedContent(text: string): Promise<number[]> {
    const embeddingRequest: EmbedContentRequest = {
      content: {
        parts: [
          {
            text,
          },
        ],
        role: 'user',
      },
      taskType: TaskType.RETRIEVAL_DOCUMENT,
    };
    const response = await this.generativeModel.embedContent(embeddingRequest);
    return response.embedding.values;
  }

  public async embedQuestion(question: string): Promise<number[]> {
    const embeddingRequest: EmbedContentRequest = {
      content: {
        parts: [
          {
            text: question,
          },
        ],
        role: 'user',
      },
      taskType: TaskType.RETRIEVAL_QUERY,
    };
    const response = await this.generativeModel.embedContent(embeddingRequest);
    return response.embedding.values;
  }
}
