import { ObjectId } from 'mongodb';

export class Faq {
  _id: ObjectId;
  category_id: ObjectId;
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
  embedding: number[] | null;
}
