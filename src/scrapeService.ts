import { AxiosError, AxiosResponse } from "axios";
import { JSDOM } from 'jsdom';

// added to fix css error
const jsdom = require('jsdom');
const axios = require('axios');

// get the HTML from the webpage using axios
function getPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then((res: AxiosResponse<any, any>) => res.data)
    .catch((error: AxiosError) => {
      if (error.config) {
        console.error(`There was an error with ${error.config.url}.`);
      }
      console.error(error.toJSON());
    });
  return HTMLData;
}

// extrapolate the HTML as a DOM document that we can extract the data from
export async function fetchFromWeb(url: string): Promise<Document> {
  let HTMLData = await getPage(url);
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.on('error', () => {
    // Skip console errors because there is one about stylesheets that is irrelevant
  });
  const dom = new JSDOM(HTMLData, {virtualConsole});
  return dom.window.document;
}
