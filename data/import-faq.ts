import * as fs from 'fs/promises';
import * as path from 'path';
import {
  MongoClient,
  ObjectId,
  SearchIndexDescription,
  ServerApiVersion,
} from 'mongodb';
import { config } from 'dotenv';
import { EmbeddingService } from 'src/embedding/embedding.service';

config();

// Check môi trường
const MONGO_URI = process.env.MONGO_URI;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!MONGO_URI || !GOOGLE_API_KEY) {
  throw new Error('Missing environment variables: MONGO_URI or GOOGLE_API_KEY');
}

// Kết nối MongoDB
const client = new MongoClient(MONGO_URI, { serverApi: ServerApiVersion.v1 });
const database = client.db('iconic');
const faqCollection = database.collection('faqs');
const faqCategoryCollection = database.collection('faqCategories');

async function insertFaqs(faqs: any[]) {
  if (!faqs.length) return;

  try {
    const result = await faqCollection.insertMany(faqs);
    console.log(`Inserted ${result.insertedCount} FAQs`);
  } catch (error) {
    console.error('Failed to insert FAQs:', error);
  }
}

async function insertCategories(categories: any[]) {
  if (!categories.length) return;

  try {
    const result = await faqCategoryCollection.insertMany(
      categories.map((category) => {
        const { _id, ...rest } = category;
        return {
          ...rest,
          _id: new ObjectId(_id.$oid as string),
        };
      }),
    );
    console.log(`Inserted ${result.insertedCount} categories`);
  } catch (error) {
    console.error('Failed to insert categories:', error);
  }
}

async function createSearchIndex() {
  const index: SearchIndexDescription = {
    name: 'faqSearchIndex',
    type: 'vectorSearch',
    definition: {
      fields: [
        {
          type: 'vector',
          path: 'embedding',
          similarity: 'dotProduct',
          numDimensions: 768,
        },
      ],
    },
  };

  try {
    await faqCollection.createSearchIndex(index);
    console.log('Search indexes created successfully');
  } catch (error) {
    console.error('Failed to create search indexes:', error);
  }
}

async function main() {
  const embeddingService = new EmbeddingService();
  const faqFilePath = path.join(__dirname, '../assets/faqs.json');
  const categoryFilePath = path.join(__dirname, '../assets/faqCategories.json');
  try {
    // Đọc file JSON bất đồng bộ
    const faqFileData = await fs.readFile(faqFilePath, 'utf-8');
    const faqs = JSON.parse(faqFileData);

    const categoryFileData = await fs.readFile(categoryFilePath, 'utf-8');
    const categories = JSON.parse(categoryFileData);

    // Chèn danh mục trước
    await insertCategories(categories);

    // Xử lý dữ liệu và chèn vào MongoDB
    const data = await Promise.all(
      faqs.map(async (faq) => {
        const text = `${faq.question} ${faq.answer}`;

        return {
          category_id: new ObjectId(faq.category_id.$oid as string),
          question: faq.question,
          answer: faq.answer,
          createdAt: new Date(faq.createdAt),
          updatedAt: new Date(faq.updatedAt),
          embedding: await embeddingService.embedContent(text),
        };
      }),
    );

    await insertFaqs(data);
    await createSearchIndex();
  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    await client.close();
  }
}

main();
