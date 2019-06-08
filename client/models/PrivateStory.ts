import { Model } from 'radiks';

class PrivateStoryModel extends Model {
  static className = 'PrivateStory';

  static schema = {
    title: {
      type: String,
      decrypted: false,
    },
    content: {
      type: String,
      decrypted: false,
    },
    excerpt: {
      type: String,
      decrypted: false,
    },
    metaTitle: {
      type: String,
      decrypted: false,
    },
    metaDescription: {
      type: String,
      decrypted: false,
    },
  };
}

export const PrivateStory = PrivateStoryModel as any;