import { Client, Account } from 'appwrite';
import conf from '../conf/conf';

class AuthService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  createAccount({ email, password, name }) {
    const userId = email.split('@')[0];
    return this.account.create(userId, email, password, name);
  }

  login({ email, password }) {
    return this.account.createEmailPasswordSession(email, password);
  }

  logout() {
    return this.account.deleteSessions();
  }

  getCurrentUser() {
    return this.account.get(); 
  }

  updatePrefs(prefs) {
    return this.account.updatePrefs(prefs);
  }
}

export default new AuthService();
