import { Injectable } from '@nestjs/common';
import { CreateFaqCategoryDto } from './dto/create-faq_category.dto';
import { UpdateFaqCategoryDto } from './dto/update-faq_category.dto';
import { MongoClient, Collection, ObjectId } from 'mongodb';
import { FaqCategory } from './entities/faq_category.entity';

@Injectable()
export class FaqCategoryService {
  private readonly mongoClient: MongoClient;
  private readonly collection: Collection;
  constructor() {
    this.mongoClient = new MongoClient(process.env.MONGO_URI);
    this.collection = this.mongoClient.db('iconic').collection('faq_category');
  }
  async create(createFaqCategoryDto: CreateFaqCategoryDto) {
    const faqCategory: FaqCategory = {
      _id: new ObjectId(),
      name: createFaqCategoryDto.name,
      description: createFaqCategoryDto.description,
    };
    await this.collection.insertOne(faqCategory);
    return faqCategory;
  }

  async findAll(limit: number, offset: number) {
    return this.collection.find().skip(offset).limit(limit).toArray();
  }

  findOne(id: ObjectId) {
    return this.collection.findOne({
      _id: id,
    });
  }

  async update(id: ObjectId, updateFaqCategoryDto: UpdateFaqCategoryDto) {
    await this.collection.updateOne(
      {
        _id: id,
      },
      {
        $set: updateFaqCategoryDto,
      },
    );
    return await this.findOne(id);
  }

  async remove(id: ObjectId) {
    await this.collection.deleteOne({
      _id: id,
    });
  }
}
