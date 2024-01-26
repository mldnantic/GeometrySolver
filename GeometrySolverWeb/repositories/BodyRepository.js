const BodyModel = require('./BodyModel');

class BodyRepository {
  constructor() {}

  async createBody(bodyData) {
    try {
      const body = await BodyModel.create(bodyData);
      return body;
    } catch (error) {
      throw error;
    }
  }

  //update project name, figures list, comments list
  async addComment(id, comment) {
    try {
      const filter = {_id: id};
      const update = { $push: { comments: comment } };
      const result = await BodyModel.updateOne(filter, update);

      if(result.modifiedCount === 1)
      {
        return comment;
      }
      else
      {
        console.log("nothing happened...");
      }
    } catch (error) {
      throw error;
    }
  }

  async getBodyById(id) {
    try {
      const body = await BodyModel.findById(id);
      return body;
    } catch (error) {
      throw error;
    }
  }

  async getAllBodies() {
    try {
      const bodies = await BodyModel.find();
      return bodies;
    } catch (error) {
      throw error;
    }
  }

  async deleteBody(id) {
    try {
      const result = await BodyModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BodyRepository();