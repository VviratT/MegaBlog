import { Client, Databases, Storage, ID, Query, Permission, Role } from 'appwrite';
import conf from '../conf/conf';

class AppwriteService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage   = new Storage(this.client);
  }

  // — File upload & preview URL —
  async uploadFile(file) {
    const res = await this.storage.createFile(
      conf.appwriteBucketId, ID.unique(), file
    );
    return res.$id;
  }
  getFileView(fileId) {
    return this.storage.getFileView(conf.appwriteBucketId, fileId);
  }
  getFilePreview(fileId) {
    return this.storage.getFilePreview(conf.appwriteBucketId, fileId);
  }

  // — Posts CRUD —
  async getPosts(filters = [ Query.equal('status','active') ]) {
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      filters
    );
    return documents;
  }

  async getPostBySlug(slug) {
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      [ Query.equal('slug', slug) ]
    );
    if (!documents.length) throw new Error(`Post not found: ${slug}`);
    return documents[0];
  }

  createPost(data) {
    return this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      data.slug, data
    );
  }
  updatePost(id, data) {
    return this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id, data
    );
  }
  deletePost(id) {
    return this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      id
    );
  }
  async countLikes(postId, type) {
    const { total } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteLikesCollectionId,
      [
        Query.equal('postId', postId),
        Query.equal('type', type)
      ],
      0,
      0
    );
    return total;
  }


  // — Likes toggle 
  async toggleLike(postId, userId, type) {
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteLikesCollectionId,
      [
        Query.equal('postId', postId),
        Query.equal('userId', userId)
      ]
    );
    const existing = documents[0] || null;

    if (existing) {
      if (existing.type === type) {
        // remove
        return this.databases.deleteDocument(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          existing.$id
        );
      } else {
        // switch
        return this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteLikesCollectionId,
          existing.$id,
          { type }
        );
      }
    } else {
      // create
      return this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteLikesCollectionId,
        ID.unique(),
        { postId, userId, type },
        [
          Permission.read(Role.any()),
          Permission.write(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      );
    }
  }

  // — Comments —
  async getComments(postId) {
    const { documents } = await this.databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCommentsCollectionId,
      [
        Query.equal('postId', postId),
        Query.orderDesc('createdAt')
      ]
    );
    return documents;
  }

  async createComment({ postId, userId, userName, userImage, content }) {
    return this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCommentsCollectionId,
      ID.unique(),
      { postId, userId, userName, userImage, content, createdAt: new Date().toISOString() },
      [
        Permission.read(Role.any()),
        Permission.write(Role.users()),
        Permission.delete(Role.user(userId))
      ]
    );
  }
}

export default new AppwriteService();
