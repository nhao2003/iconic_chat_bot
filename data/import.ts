import * as fs from 'fs/promises';
import * as path from 'path';
import { MongoClient, SearchIndexDescription, ServerApiVersion } from 'mongodb';
import { Product } from './models/product';
import { getText } from './ultis';
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
const collection = database.collection('products');

async function insertProducts(products: any[]) {
  if (!products.length) return;

  try {
    const result = await collection.insertMany(products);
    console.log(`Inserted ${result.insertedCount} products`);
  } catch (error) {
    console.error('Failed to insert products:', error);
  }
}

async function createSearchIndex() {
  const index: SearchIndexDescription = {
    name: 'searchIndex',
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
    await collection.createSearchIndex(index);
    console.log('Search indexes created successfully');
  } catch (error) {
    console.error('Failed to create search indexes:', error);
  }
}

async function main() {
  const embeddingService = new EmbeddingService();
  const filePath = path.join(__dirname, '../assets/products.json');

  try {
    // Đọc file JSON bất đồng bộ
    const fileData = await fs.readFile(filePath, 'utf-8');
    const products: Product[] = JSON.parse(fileData);

    // // Xử lý dữ liệu và chèn vào MongoDB
    const data = await Promise.all(
      products.map(async (product) => {
        const text = getText(product);

        return {
          original_id: product.id,
          name: product.name,
          description: text,
          price: product.price,
          embedding: await embeddingService.embedContent(text),
        };
      }),
    );

    await insertProducts(data);
    await createSearchIndex();
  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    await client.close();
  }
}

main();
