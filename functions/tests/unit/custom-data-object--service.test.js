const customDataObjectService = require('../../src/services/custom-data-object-service');
const customDataObjectRecordsRepository = require('../../src/repositories/custom-data-object-records-repository');

jest.mock('../../src/repositories/custom-data-object-records-repository', () => ({
    createMultiple: jest.fn()
}));

describe('CustomDataObjectService.importRecords', () => {
    const MAX_BATCH_SIZE = 500; // You may need to adjust this if it's defined elsewhere

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call createMultiple once if records length is less than MAX_BATCH_SIZE', async () => {
        const records = Array.from({ length: 100 }, (_, i) => ({ id: i }));
        await customDataObjectService.importRecords(records);
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledTimes(1);
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledWith(records);
    });

    it('should call createMultiple multiple times if records length exceeds MAX_BATCH_SIZE', async () => {
        const records = Array.from({ length: 1200 }, (_, i) => ({ id: i }));
        await customDataObjectService.importRecords(records);
        // 1200 / 500 = 2 full batches + 1 partial batch
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenCalledTimes(3);
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(1, records.slice(0, 500));
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(2, records.slice(500, 1000));
        expect(customDataObjectRecordsRepository.createMultiple).toHaveBeenNthCalledWith(3, records.slice(1000, 1200));
    });

    it('should not call createMultiple if records array is empty', async () => {
        await customDataObjectService.importRecords([]);
        expect(customDataObjectRecordsRepository.createMultiple).not.toHaveBeenCalled();
    });
});
