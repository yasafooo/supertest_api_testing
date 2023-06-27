const request = require('supertest');
const { baseUrl } = require('../config/url');

class PetService {
  async makeRequest(method, endpoint, payload = {}) {
    const response = await request(baseUrl)[method](endpoint).send(payload);
    return response.body;
  }

  async addPet(pet) {
    return this.makeRequest('post', '/pet', pet);
  }

  async updatePet(pet) {
    return this.makeRequest('put', '/pet', pet);
  }

  async findPetsByStatus(status) {
    return this.makeRequest('get', '/pet/findByStatus?status='+status, { });
  }

  async findPetsByTags(tags) {
    let str ='/pet/findByTags?'
    const params = tags.map(tag => `tags=${tag}`).join("&");
    return this.makeRequest('get', str+params, { });
  }
}

module.exports = PetService;