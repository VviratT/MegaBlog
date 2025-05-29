import { Client, Account } from 'appwrite';
import conf from '../conf/conf';

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    const userId = email.split('@')[0];
    return this.account.create(userId, email, password, name);
  }

  async login({ email, password }) {
    return this.account.createEmailPasswordSession(email, password);
  }

  async logout() {
    return this.account.deleteSessions();
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (err) {
      if (err.message.includes('missing scope') || err.code === 401) {
        return null;
      }
      throw err;
    }
  }

  async updatePrefs(prefs) {
    return this.account.updatePrefs(prefs);
  }
}

export default new AuthService();
