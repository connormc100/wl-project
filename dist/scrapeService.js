var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { JSDOM } from 'jsdom';
// added to fix css error
const jsdom = require('jsdom');
const axios = require('axios');
// get the HTML from the webpage using axios
function getPage(url) {
    const HTMLData = axios
        .get(url)
        .then((res) => res.data)
        .catch((error) => {
        if (error.config) {
            console.error(`There was an error with ${error.config.url}.`);
        }
        console.error(error.toJSON());
    });
    return HTMLData;
}
// extrapolate the HTML as a DOM document that we can extract the data from
export function fetchFromWeb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let HTMLData = yield getPage(url);
        const virtualConsole = new jsdom.VirtualConsole();
        virtualConsole.on('error', () => {
            // Skip console errors because there is one about stylesheets that is irrelevant
        });
        const dom = new JSDOM(HTMLData, { virtualConsole });
        return dom.window.document;
    });
}
//# sourceMappingURL=scrapeService.js.map