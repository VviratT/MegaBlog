// src/appwrite/service.js
import conf from '../conf/conf.js';
import { Client, Databases, Storage, ID, Query } from 'appwrite';
import { Permission, Role } from 'appwrite';

class AppwriteService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.storage   = new Storage(this.client);
  }

async uploadFile(file) {
  const uploadedFile = await this.storage.createFile(
    conf.appwriteBucketId,
    ID.unique(),
    file
  );
  return uploadedFile.$id;  
}


  getFilePreview(fileId) {
    return this.storage.getFileView(conf.appwriteBucketId, fileId);
  }

  async createPost({ title, content, featuredImage, slug, userid }) {
    const docId = ID.unique();
    return this.databases.createDocument(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    docId,
    { title, content, featuredImage, userid, slug, status: 'active' },
      [
        Permission.read(Role.user(userid)),
        Permission.update(Role.user(userid)),
        Permission.delete(Role.user(userid)),
      ]
    );
  }

  async updatePost(docId, data) {
  return this.databases.updateDocument(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    docId,
    data
  );
}

  async deletePost(slug) {
    return this.databases.deleteDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug
    );
  }

  async getPost(slug) {
    return this.databases.getDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      slug
    );
  }

  // ← This is the one needed for listing all posts:
  async getPosts(queries = [ Query.equal('status', 'active') ]) {
   const res = await this.databases.listDocuments(
     conf.appwriteDatabaseId,
     conf.appwriteCollectionId,
     queries
   );
   return res.documents;
 }


  async getPostBySlug(slug) {
  const res = await this.databases.listDocuments(
    conf.appwriteDatabaseId,
    conf.appwriteCollectionId,
    [ Query.equal('slug', slug), Query.limit(1) ]
  );
  return res.documents[0];
}
}

const appService = new AppwriteService();
export default appService;
