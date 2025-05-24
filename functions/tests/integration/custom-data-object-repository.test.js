const customDataObjectRepository = require('../../src/repositories/custom-data-object-repository');

describe('Custom Data Object Repository', () => {

	afterEach(async () => {
		// Delete all test data
		const items = await customDataObjectRepository.getAll();
		for (const item of items) {
			await customDataObjectRepository.delete(item.id);
		};

	});

	it('Add a new custom data object', async () => {
		await customDataObjectRepository.create({ name: 'Payment Schedule', code : 'code' });
		const cdos = await customDataObjectRepository.getAll();
		expect(cdos[0].id).toBeDefined();
		expect(cdos[0].id).not.toBeNull();
		expect(cdos[0]).toEqual({ id: cdos[0].id, name: 'Payment Schedule', code: 'code' });
	});

	it("should retrieve single item using 'getByName' method", async () => {
		await customDataObjectRepository.create({ name: 'new CDO', code : 'code' });
		const cdos = await customDataObjectRepository.getByName("new CDO");
		expect(cdos.length).toBeGreaterThan(0);
		expect(cdos[0].name).toBe('new CDO');
	});

	it("should return null if no item found.", async () => {
		await customDataObjectRepository.create({ name: 'new CDO', code: 'code' });
		const cdos = await customDataObjectRepository.getByName("new CDO12");
		expect(cdos.length).toBe(0);
	});
});
