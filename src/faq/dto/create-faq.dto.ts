import { ObjectId } from 'mongodb';

export class CreateFaqDto {
  category_id: string | ObjectId;
  question: string;
  answer: string;
}
