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
});
