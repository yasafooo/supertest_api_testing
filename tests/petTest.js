const assert = require('assert');
const fs = require('fs');
const PetService = require('../services/petService');
const testData = require('../data/pets.json');

describe('Pet API Tests', function () {
  this.timeout(10000);
  let petId;
  const petService = new PetService();

  it('should add a new pet to the store and store the ID in a JSON file', async function () {
    const newPet = testData.newPet;

    const response = await petService.addPet(newPet);
    console.log(response);
    petId = response.id;

    assert.strictEqual(response.name, newPet.name, 'New pet name does not match');
    assert.deepStrictEqual(response.tags, newPet.tags, 'New pet tags do not match');
    assert.strictEqual(typeof response.id, 'number', 'New pet ID is not a number');
    
    fs.writeFileSync('petId.json', JSON.stringify({ id: petId }));

  });

  it('should create at least 4 pets with different tags and status', async function () {
    const pets = testData.pets;

    for (const pet of pets) {
      const response = await petService.addPet(pet);
      console.log(response);
      assert.strictEqual(response.name, pet.name, 'Created pet name does not match');
      assert.deepStrictEqual(response.tags, pet.tags, 'Created pet tags do not match');
      assert.strictEqual(typeof response.id, 'number', 'Created pet ID is not a number');
    }
  });

  it('should update an existing pet', async function () {
    const updatedPet = testData.updatedPet;
    updatedPet.id = petId;

    const response = await petService.updatePet(updatedPet);
    console.log(response);
    assert.strictEqual(response.name, updatedPet.name, 'Updated pet name does not match');
    assert.strictEqual(response.status, updatedPet.status, 'Updated pet status does not match');
    assert.strictEqual(typeof response.id, 'number', 'Updated pet ID is not a number');
  });

  it('should find pets by status', async function () {
    const status = testData.findPetsByStatus;
    const response = await petService.findPetsByStatus(status);
    console.log(response);

    assert.ok(response.length > 0, 'No pets found for the given status');

    for (const pet of response) {
      assert.strictEqual(pet.status, status, 'Found pet has incorrect status');
      assert.strictEqual(typeof pet.id, 'number', 'Found pet ID is not a number');
    }
  });

  it('should find pets by tags', async function () {
    const tags = testData.findPetsByTags;
    const response = await petService.findPetsByTags(tags);
    console.log(JSON.stringify(response));

    assert.ok(response.length > 0, 'No pets found for the given tags');

    for (const pet of response) {
      console.log(`Checking pet ID ${pet.id} - ${pet.name}`);
      console.log(`Tags: ${pet.tags.map(tag => tag.name).join(', ')}`);

      const petTagNames = new Set(pet.tags.map(tag => tag.name.toLowerCase()));
      const lowercaseTags = new Set(tags.map(tag => tag.toLowerCase()));

      const hasIntersection = [...lowercaseTags].some(tag => petTagNames.has(tag));
      assert.ok(hasIntersection, `Found pet does not have the specified tags: ${tags}`);

      assert.strictEqual(typeof pet.id, 'number', 'Found pet ID is not a number');
      assert.strictEqual(typeof pet.name, 'string', 'Found pet name is not a string');
      assert.ok(pet.tags.length > 0, 'Found pet has an empty tags array');
    }
  });
});