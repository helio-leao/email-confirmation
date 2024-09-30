import UserVerification from "../types/UserVerification";

export default class UserVerifications {
  private static userVerifications: UserVerification[] = [];

  static getAll() {
    return [...this.userVerifications];
  }

  static add(userVerification: UserVerification) {
    this.userVerifications.push(userVerification);
  }

  static find(userId: string) {
    const userVerification = this.userVerifications.find(
      (verification) => verification.userId === userId
    );
    return userVerification;
  }

  static remove(userId: string) {
    this.userVerifications = this.userVerifications.filter(
      (userVerification) => userVerification.userId !== userId
    );
  }
}
