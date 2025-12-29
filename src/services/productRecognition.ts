/**
 * Product Recognition & Store Search Service
 * Auto-fills product details and finds stores when items are scanned
 */

export interface ProductInfo {
  name: string;
  brand?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  barcode?: string;
}

export interface StoreAvailability {
  storeName: string;
  distance?: number;
  price?: number;
  inStock: boolean;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export interface ProductSearchResult {
  product: ProductInfo;
  stores: StoreAvailability[];
}

/**
 * Recognize product from barcode/SKU
 */
export async function recognizeProductFromBarcode(
  barcode: string
): Promise<ProductSearchResult | null> {
  try {
    // Use Open Food Facts API (free, no key required)
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status === 1 && data.product) {
      const product = data.product;

      const productInfo: ProductInfo = {
        name: product.product_name || 'Unknown Product',
        brand: product.brands || undefined,
        category: product.categories || undefined,
        description: product.generic_name || undefined,
        imageUrl: product.image_url || undefined,
        barcode: barcode,
      };

      // Search stores for this product
      const stores = await searchStoresForProduct(productInfo);

      return {
        product: productInfo,
        stores: stores,
      };
    }

    // Fallback: try UPC Database (requires API key but has free tier)
    return await searchUPCDatabase(barcode);
  } catch (error) {
    console.error('Barcode recognition error:', error);
    return null;
  }
}

/**
 * Recognize product from image using Google Cloud Vision API
 */
export async function recognizeProductFromImage(
  imageUri: string
): Promise<ProductSearchResult | null> {
  try {
    // Option 1: Google Cloud Vision API (requires API key)
    const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY || '';

    if (!apiKey || apiKey.startsWith('YOUR_')) {
      console.warn('Cloud Vision API key not configured, using basic image analysis');
      return null;
    }

    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageUri }, // Base64 encoded image
            features: [
              { type: 'LABEL_DETECTION', maxResults: 5 },
              { type: 'TEXT_DETECTION' },
              { type: 'LOGO_DETECTION' },
              { type: 'PRODUCT_SEARCH' },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    if (data.responses && data.responses[0]) {
      const result = data.responses[0];

      // Extract product info from labels and logos
      const labels = result.labelAnnotations?.map((l: any) => l.description) || [];
      const logos = result.logoAnnotations?.map((l: any) => l.description) || [];
      const text = result.textAnnotations?.[0]?.description || '';

      const productInfo: ProductInfo = {
        name: labels[0] || 'Unknown Product',
        brand: logos[0] || extractBrandFromText(text),
        category: labels[1] || undefined,
        description: labels.slice(0, 3).join(', '),
      };

      const stores = await searchStoresForProduct(productInfo);

      return {
        product: productInfo,
        stores: stores,
      };
    }

    return null;
  } catch (error) {
    console.error('Image recognition error:', error);
    return null;
  }
}

/**
 * Search stores that carry a product
 */
async function searchStoresForProduct(product: ProductInfo): Promise<StoreAvailability[]> {
  try {
    const searchQuery = `${product.brand || ''} ${product.name}`.trim();

    // Use Google Places API to find stores
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || '';

    if (!apiKey || apiKey.startsWith('YOUR_')) {
      // Return mock data for now
      return getMockStoreAvailability(product);
    }

    // Get user's current location (passed from app)
    // For now, using mock location
    const latitude = 37.7749;
    const longitude = -122.4194;

    const response = await fetch(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        `location=${latitude},${longitude}&` +
        'radius=5000&' +
        `keyword=${encodeURIComponent(searchQuery)}&` +
        'type=store&' +
        `key=${apiKey}`
    );

    const data = await response.json();

    if (data.results) {
      return data.results.slice(0, 5).map((place: any) => ({
        storeName: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        inStock: true, // Assume in stock (would need store API to verify)
        distance: undefined, // Calculate based on user location
        price: undefined, // Would need store API for pricing
      }));
    }

    return [];
  } catch (error) {
    console.error('Store search error:', error);
    return getMockStoreAvailability(product);
  }
}

/**
 * Fallback UPC database search
 */
async function searchUPCDatabase(barcode: string): Promise<ProductSearchResult | null> {
  try {
    // UPC Database API (free tier available)
    const response = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const item = data.items[0];

      const productInfo: ProductInfo = {
        name: item.title,
        brand: item.brand,
        category: item.category,
        description: item.description,
        imageUrl: item.images?.[0],
        barcode: barcode,
      };

      const stores = await searchStoresForProduct(productInfo);

      return {
        product: productInfo,
        stores: stores,
      };
    }

    return null;
  } catch (error) {
    console.error('UPC database error:', error);
    return null;
  }
}

/**
 * Extract brand name from OCR text
 */
function extractBrandFromText(text: string): string | undefined {
  // Simple heuristic: first capitalized word/phrase
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // Return first line if it looks like a brand (all caps or title case)
    if (firstLine.length > 0 && firstLine.length < 30) {
      return firstLine;
    }
  }
  return undefined;
}

/**
 * Mock store availability (fallback when APIs not configured)
 */
function getMockStoreAvailability(_product: ProductInfo): StoreAvailability[] {
  const stores = ['Target', 'Walmart', 'Whole Foods', 'Safeway', 'CVS'];

  return stores.map((name, index) => ({
    storeName: name,
    distance: (index + 1) * 0.5, // 0.5mi, 1mi, 1.5mi, etc.
    price: Math.random() * 20 + 5, // Random price $5-$25
    inStock: Math.random() > 0.2, // 80% in stock
    address: `${Math.floor(Math.random() * 9000 + 1000)} Main St`,
  }));
}
