export interface Product {
  id: number;
  name: string;
  description: string | ProductDescription[];
  price: number;
  discountedPrice: any;
  imageUrl: string;
  imageCoverUrls: string[];
  specifications?: string | ProductSpec[];
  type: string;
  brand: string;
  quantityInStock: number;
  visibility: boolean;
  sku: string;
  barcode: string;
  weight: number;
  category: any;
  productAttributes: any[];
  variants: Variant[];
  productCustomOptions: any[];
}

export interface Variant {
  id: number;
  sku: string;
  price: number;
  imageUrl: string;
  attributeValues: AttributeValue[];
}

export interface AttributeValue {
  id: number;
  optionText: string;
  variantId: number;
  attributeId: number;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface ProductDescription {
  type: 'text' | 'image' | 'ul';
  image?: DescriptonImage;
  text?: string;
}

export interface DescriptonImage {
  height: number;
  width: number;
  uri: string;
  url_list: string[];
}
