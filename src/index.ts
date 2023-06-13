import { extractData } from './extractionService';
import { Product } from './interfaces/product';
import { fetchFromWeb } from './scrapeService';

// main function we run
async function runProject(url: string): Promise<Product[]> {
  const document = await fetchFromWeb(url);
  const productList = extractData(document);
  // Note: we log it to display for the user
  console.log(productList);
  return productList;
}

runProject('https://wltest.dns-systems.net/');