import * as extractionService from './extractionService';
import { JSDOM } from 'jsdom';
import { mockWebsite } from './mock/website.mock';
import { mockWrongWebsite } from './mock/wrongWebsite.mock';

// added to fix css error
const jsdom = require('jsdom');

const mockProducts = [
  {
    "description": "Third description",
    "discount": 3.33,
    "option_title": "Third",
    "price": 150,
  },
  {
    "description": "Second description",
    "discount": 2.22,
    "option_title": "Second",
    "price": 100,
  },
  {
    "description": "First description",
    "discount": 1.11,
    "option_title": "First",
    "price": 50,
  },
];

const wrongMockProducts = [
  {
    "description": "",
    "discount": -1,
    "option_title": "First",
    "price": -1,
  },
  {
    "description": "",
    "discount": -1,
    "option_title": "Second",
    "price": -1,
  },
  {
    "description": "",
    "discount": -1,
    "option_title": "Third",
    "price": -1,
  },
];

fdescribe('extractData', () => {
  let mockDocument: Document;
  let wrongMockDocument: Document;
  let documentDivs: HTMLDivElement[];
  beforeAll(() => {
    let correctHTMLData = mockWebsite;
    let wrongHTMLData = mockWrongWebsite;
    const virtualConsole = new jsdom.VirtualConsole();
    const correctDom = new JSDOM(correctHTMLData, {virtualConsole});
    mockDocument = correctDom.window.document;
    const wrongDom = new JSDOM(wrongHTMLData, {virtualConsole});
    wrongMockDocument = wrongDom.window.document;
    documentDivs = Array.from(
      mockDocument.querySelectorAll('div.package'),
    );
    // Remove the first three divs as they are not needed, monthly not annual
    documentDivs = documentDivs.slice(3);
  })
  afterEach(() => {
    jest.resetAllMocks();
  })
  it('should get the relevant products', () => {
    expect(extractionService.extractData(mockDocument)).toEqual(mockProducts);
  });

  it('should return errors if there are issues', () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    expect(extractionService.extractData(wrongMockDocument)).toEqual(wrongMockProducts);
    expect(console.error).toHaveBeenCalled();
  });

  it('should get the correct product from the div', () => {
    expect(extractionService.getProductFromDiv(documentDivs[0])).toEqual(mockProducts[2]);
    expect(extractionService.getProductFromDiv(documentDivs[1])).toEqual(mockProducts[1]);
    expect(extractionService.getProductFromDiv(documentDivs[2])).toEqual(mockProducts[0]);
  });

});