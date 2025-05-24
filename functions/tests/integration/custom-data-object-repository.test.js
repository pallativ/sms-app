const customDataObjectRepository = require('../../src/repositories/custom-data-object-repository');

describe('Custom Data Object Repository', () => {

	afterEach(async () => {
		// Delete all test data
		const items = await customDataObjectRepository.getAll();
		for (const item of items) {
			await customDataObjectRepository.delete(item.id);
		};

	});

	it('create a new custom data object', async () => {
		await customDataObjectRepository.create({ name: 'Payment Schedule', code: 'code' });
		const cdos = await customDataObjectRepository.getAll();
		expect(cdos[0].id).toBeDefined();
		expect(cdos[0].id).not.toBeNull();
		expect(cdos[0]).toEqual({ id: cdos[0].id, name: 'Payment Schedule', code: 'code' });
	});

	it('should edit an existing item', async () => {
		const validAttribute = {
			id: 1,
			code: "firstName",
			order: 1,
			name: 'First Name',
			type: 'string',
			multiselect: false,
			id_columns: ["id"],
			required: true
		};
		const newCdo = {
			name: 'Sample', code: 'Sample', description: "Description", attributes: [validAttribute],
			records: [{ firstName: 'Veera' }]
		};
		await customDataObjectRepository.create(newCdo);
		const cdos = await customDataObjectRepository.getAll();
		expect(cdos[0].id).toBeDefined();
		expect(cdos[0].id).not.toBeNull();
		expect(cdos[0]).toEqual({ id: cdos[0].id, name: 'Sample', code: 'Sample', description: "Description" });

		const editVersion = { ...cdos[0], name: 'Edit Version v1' };
		await customDataObjectRepository.edit(editVersion.id, editVersion);

		const editReadVersion = await customDataObjectRepository.getByName(editVersion.name);
		/*console.log('Edit Version of the document:', editReadVersion);*/
		expect(editReadVersion[0].id).toBeDefined();
		expect(editReadVersion[0].id).not.toBeNull();
		expect(editReadVersion[0]).toEqual({ id: cdos[0].id, name: 'Edit Version v1', code: 'Sample', description: "Description" });
		expect(editReadVersion[0].attributes).toBeUndefined();
		expect(editReadVersion[0].records).toBeUndefined();
		expect(editReadVersion[0].auditLog).toBeUndefined();
	});

	it("should retrieve single item using 'getByName' method", async () => {
		await customDataObjectRepository.create({ name: 'new CDO', code: 'code' });
		const cdos = await customDataObjectRepository.getByName("new CDO");
		expect(cdos.length).toBeGreaterThan(0);
		expect(cdos[0].name).toBe('new CDO');
	});

	it("should delete the items if exists", async () => {
		await customDataObjectRepository.create({ name: 'Delete', code: 'code' });
		let cdos = await customDataObjectRepository.getByName("Delete");
		await customDataObjectRepository.delete(cdos[0].id);
		cdos = await customDataObjectRepository.getByName("Delete");
		expect(cdos.length).toBe(0);
	});

	it("shouldn't fail delete action if an item not exists", async () => {
		await customDataObjectRepository.delete('acbdfdfasdfasdf');
	});

	it("should return null if no item found.", async () => {
		await customDataObjectRepository.create({ name: 'new CDO', code: 'code' });
		const cdos = await customDataObjectRepository.getByName("new CDO12");
		expect(cdos.length).toBe(0);
	});


});
