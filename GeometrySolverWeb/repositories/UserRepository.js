const UserModel = require('./UserModel.js');

class UserRepository {
  constructor() {}

  async createUser(userData) {
    try {
      const user = await UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await UserModel.findOne(username);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      throw error;
    }
  }

  //add to/update projects list

  //remove from projects list

}

module.exports = new UserRepository();
