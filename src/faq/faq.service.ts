import { Injectable } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqService {
  private readonly mongoClient: MongoClient;
  private readonly faqCollection: Collection;
  private readonly faqCategoryCollection: Collection;
  private readonly embeddingService: EmbeddingService;
  constructor() {
    this.mongoClient = new MongoClient(process.env.MONGO_URI);
    this.faqCollection = this.mongoClient.db('iconic').collection('faqs');
    this.faqCategoryCollection = this.mongoClient
      .db('iconic')
      .collection('faqCategories');
  }
  async create(createFaqDto: CreateFaqDto) {
    const embedding = await this.embeddingService.embedContent(
      createFaqDto.question,
    );
    const faq: Faq = {
      _id: new ObjectId(),
      category_id: new ObjectId(createFaqDto.category_id),
      question: createFaqDto.question,
      answer: createFaqDto.answer,
      createdAt: new Date(),
      updatedAt: new Date(),
      embedding,
    };
    await this.faqCollection.insertOne(faq);
    return faq;
  }

  async findAll(limit: number, offset: number, category_id: ObjectId | null) {
    const query = category_id ? { category_id } : {};
    return await this.faqCollection
      .find(query)
      .skip(offset)
      .limit(limit)
      .toArray();
  }

  async findRelatedQuestions(embedding: number[]) {
    const pipeline = [
      {
        $vectorSearch: {
          index: 'faqSearchIndex',
          queryVector: embedding,
          path: 'embedding',
          exact: true,
          limit: 5,
        },
      },
      {
        $addFields: {
          score: {
            $meta: 'vectorSearchScore',
          },
        },
      },
      {
        $project: {
          embedding: 0,
        },
      },
    ];

    const cursor = this.faqCollection.aggregate(pipeline);
    return cursor.toArray();
  }

  async findOne(id: ObjectId) {
    return await this.faqCollection.findOne({
      _id: id,
    });
  }

  async update(id: ObjectId, updateFaqDto: UpdateFaqDto) {
    await this.faqCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: updateFaqDto,
      },
    );
    return await this.findOne(id);
  }

  async remove(id: ObjectId) {
    await this.faqCollection.deleteOne({
      _id: id,
    });
  }
}
