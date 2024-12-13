import { ObjectId } from 'mongodb';

export class FaqCategory {
  _id: ObjectId;
  name: string;
  description: string;
}
