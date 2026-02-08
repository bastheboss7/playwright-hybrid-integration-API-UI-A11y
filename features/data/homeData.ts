/**
 * Home/Listings Test Data
 */
export const products = {
  samsungGalaxyS6: 'Samsung galaxy s6',
  macbookAir: 'MacBook Air',
  nokiaLumia1520: 'Nokia lumia 1520',
  nexus6: 'Nexus 6',
  iphone6: 'Iphone 6 32gb'
} as const;

export const categories = {
  phones: 'Phones',
  laptops: 'Laptops',
  monitors: 'Monitors'
} as const;

export type ProductName = typeof products[keyof typeof products];
export type CategoryName = typeof categories[keyof typeof categories];

export default { products, categories };
