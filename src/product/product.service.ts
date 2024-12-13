import { Injectable } from '@nestjs/common';
import { MongoClient, Collection } from 'mongodb';

@Injectable()
export class ProductService {
  private readonly mongoClient: MongoClient;
  private readonly collection: Collection;

  constructor() {
    this.mongoClient = new MongoClient(process.env.MONGO_URI);
    this.collection = this.mongoClient.db('iconic').collection('products');
  }

  async findProducts(query_embedding: number[]): Promise<any[]> {
    const pipeline = [
      {
        $vectorSearch: {
          index: 'vector_index',
          queryVector: query_embedding,
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

    const cursor = this.collection.aggregate(pipeline);
    return cursor.toArray();
  }
}
