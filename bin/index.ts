import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';

const jsdom = require('jsdom');


function getPage(url: string): Promise<string | undefined> {
  const HTMLData = axios
    .get(url)
    .then(res => res.data)
    .catch((error: AxiosError) => {
      if (error.config) {
        console.error(`There was an error with ${error.config.url}.`);
      }
      console.error(error.toJSON());
    });
  return HTMLData;
}

async function fetchFromWeb(url: string): Promise<Document> {
  let HTMLData = await getPage(url);
  const virtualConsole = new jsdom.VirtualConsole();
  virtualConsole.on('error', () => {
    // Skip console errors because the is one about stylesheets that is irrelevant
  })
  const dom = new JSDOM(HTMLData, {virtualConsole});
  return dom.window.document;
}

interface Product {
  option_title: string;
  description: string;
  price: number;
  discount: number;
}

// option title, description, price and discount

function extractData(document: Document): Product[] {
  let documentDivs: HTMLDivElement[] = Array.from(
    document.querySelectorAll('div.package'),
  );
  // Remove the first three divs as they are not needed
  documentDivs = documentDivs.slice(3);
  const products: Product[] = [];
  documentDivs.map(div => {
    const descriptionDiv = div.querySelector('div.package-name');
    const headerDiv = div.querySelector('div.header');
    const priceSpan = div.querySelector('span.price-big');
    const discountP = div.querySelector('.package-price p');
    const newProduct: Product = {
      option_title: headerDiv && headerDiv.textContent ? headerDiv.textContent.trim().split(':')[0] : '',
      description: descriptionDiv && descriptionDiv.textContent ? descriptionDiv.textContent : '',
      price: priceSpan && priceSpan.textContent ? parseFloat(priceSpan.textContent.replace('£', '')) : -1,
      discount: discountP && discountP.textContent ? parseFloat(discountP.textContent.replace('£','').split(' ')[1]) : -1
    };
    products.push(newProduct);
  });
  const finalProducts = products.sort(function(a,b)  {
    return b.price - a.price;
  });
  return finalProducts;
}

async function runProject(url: string): Promise<Product[]> {
  const document = await fetchFromWeb(url);
  const productList = extractData(document);
  console.log(productList)
  return productList;
}

runProject('https://wltest.dns-systems.net/');