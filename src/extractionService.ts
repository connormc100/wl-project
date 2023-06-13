import { Product } from "./interfaces/product";

// get the products from the deocument
export function extractData(document: Document): Product[] {
  // First we get all packages from the document
  let documentDivs: HTMLDivElement[] = Array.from(
    document.querySelectorAll('div.package'),
  );
  // Remove the first three divs as they are not needed, monthly not annual
  documentDivs = documentDivs.slice(3);
  const products: Product[] = [];
  documentDivs.map((div) => {
    // get the product information from each div
    const newProduct = getProductFromDiv(div);
    // Note: In the unlikely event of an error we display that to the user
    if (newProduct.price === -1 || newProduct.discount === -1 || newProduct.option_title === '' || newProduct.option_title === '') {
      console.error('There has been an issue with finding the data for one of the products. Please check the webpage.');
    }
    products.push(newProduct);
  });
  // Sort the products by price in descending order as desired
  const finalProducts = products.sort(function(a,b)  {
    return b.price - a.price;
  });
  return finalProducts;
}

// allows us to verify the functionality independently
export function getProductFromDiv(div: HTMLDivElement): Product {
  const descriptionDiv = div.querySelector('div.package-name');
  const headerDiv = div.querySelector('div.header');
  const priceSpan = div.querySelector('span.price-big');
  // discount uses parent class because the p has no class
  const discountP = div.querySelector('.package-price p');
  const newProduct: Product = {
    // we add the product info via string methods and parseFloat conversions
    // with checks to ensure data is available
    option_title: headerDiv && headerDiv.textContent ? headerDiv.textContent.trim().split(':')[0] : '',
    description: descriptionDiv && descriptionDiv.textContent ? descriptionDiv.textContent : '',
    price: priceSpan && priceSpan.textContent ? parseFloat(priceSpan.textContent.replace('£', '')) : -1,
    discount: discountP && discountP.textContent ? parseFloat(discountP.textContent.replace('£','').split(' ')[1]) : -1
  };
  return newProduct;
}