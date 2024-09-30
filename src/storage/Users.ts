import User from "../types/User";

export default class Users {
  private static users: User[] = [];

  static getAll() {
    return [...this.users];
  }

  static add(newUser: User) {
    this.users.push(newUser);
  }

  static find(email: string) {
    return this.users.find((user) => user.email === email);
  }

  static updateVerifiedUser(userId: string) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === userId) {
        this.users[i].verified = true;
        break;
      }
    }
  }
}
