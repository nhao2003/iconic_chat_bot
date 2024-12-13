import { SearchIndexDescription } from 'mongodb';

const searchIndex: SearchIndexDescription = {
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

export default searchIndex;
