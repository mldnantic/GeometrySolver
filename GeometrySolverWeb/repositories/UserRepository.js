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
  async addProject(id, bodyID) {
    try {

      const filter = {_id: id};
      const update = { $push: { myProjects: bodyID } };
      const result = await UserModel.updateOne(filter, update);

      if(result.modifiedCount === 1)
      {
        return bodyID;
      }
      else
      {
        console.log("nothing happened...");
      }

    } catch (error) {
      throw error;
    }
  }
  
  //remove from projects list NE RADI
  // async removeProject(id, bodyID) {
  //   try {

  //     const filter = {_id: id};
  //     const update = { $pull: { "myProjects": bodyID}};
  //     const result = await UserModel.updateOne(filter, update);

  //     return result;

  //   } catch (error) {
  //     throw error;
  //   }
  // }

}

module.exports = new UserRepository();
