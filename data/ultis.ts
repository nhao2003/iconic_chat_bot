import { Product, ProductDescription, ProductSpec } from './models/product';

export function getText(product: Product): string {
  const name = product.name;
  let description = '';
  product.description = JSON.parse(
    product.description as string,
  ) as ProductDescription[];
  if (product.specifications)
    product.specifications = JSON.parse(product.specifications as string);

  for (const spec of product.description) {
    if (spec.type === 'text' && spec?.text.length > 0) {
      description += spec.text;
    }
  }
  if (product.specifications && product.specifications.length > 0) {
    for (const spec of product.specifications as ProductSpec[]) {
      description += `${spec.name}: ${spec.value} | `;
    }
  }

  return `${name} ${description}`;
}
