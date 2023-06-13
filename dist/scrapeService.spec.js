var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as scrapeService from './scrapeService';
const axios = require('axios');
jest.mock('axios');
describe('fetchFromWeb', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('should pass', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {};
        axios.get = jest.fn();
        axios.get.mockImplementation(() => Promise.resolve({ data: { books: [] } }));
        const mockUrl = 'exampleUrl';
        yield scrapeService.fetchFromWeb(mockUrl);
        expect(axios.get).toBeCalledWith(mockUrl);
    }));
    it('should handle error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mError = new Error('network');
        axios.mockRejectedValueOnce(mError);
        const mockUrl = 'exampleUrl';
        yield scrapeService.fetchFromWeb(mockUrl);
        expect(axios).toBeCalledWith({
            method: 'GET',
            url: 'localhost/api/books',
            headers: { Authorization: `abc` },
        });
    }));
});
//# sourceMappingURL=scrapeService.spec.js.map