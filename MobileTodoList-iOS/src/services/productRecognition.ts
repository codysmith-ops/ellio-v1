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
  size?: string;
  quantity?: number;
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
        size: product.quantity || undefined, // e.g., "355 ml", "12 oz"
        quantity: extractQuantityFromText(product.quantity || ''),
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

    // Convert image to base64
    const RNFS = require('react-native-fs');
    let base64Image = '';

    // Handle different URI formats
    const imageSource = imageUri.replace('file://', '');

    try {
      base64Image = await RNFS.readFile(imageSource, 'base64');
      console.log('✅ Image converted to base64, length:', base64Image.length);
    } catch (readError) {
      console.error('❌ Failed to read image file:', readError);
      return null;
    }

    console.log('🔍 Calling Google Cloud Vision API...');
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Image }, // Base64 encoded image
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION' },
              { type: 'LOGO_DETECTION', maxResults: 5 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log('📸 Vision API Response:', JSON.stringify(data, null, 2));

    if (data.responses && data.responses[0]) {
      const result = data.responses[0];

      // Extract product info from labels, logos, and objects
      const labels = result.labelAnnotations?.map((l: any) => l.description) || [];
      const logos = result.logoAnnotations?.map((l: any) => l.description) || [];
      const objects = result.localizedObjectAnnotations?.map((o: any) => o.name) || [];
      const text = result.textAnnotations?.[0]?.description || '';

      console.log('🏷️ Labels detected:', labels);
      console.log('🔖 Logos detected:', logos);
      console.log('📦 Objects detected:', objects);
      console.log('📝 Text detected:', text.substring(0, 100));

      // Prioritize objects for product name (more accurate)
      let productName = 'Unknown Product';
      if (objects.length > 0) {
        productName = objects[0]; // "Bottle", "Package", "Food", etc.
      } else if (labels.length > 0) {
        productName = labels[0];
      }

      // Try to extract brand from logos first, then text
      let brandName;
      if (logos.length > 0) {
        brandName = logos[0];
      } else {
        brandName = extractBrandFromText(text);
      }

      // Determine category from labels (skip generic terms)
      const genericTerms = ['product', 'package', 'bottle', 'food', 'drink', 'container'];
      const category = labels.find(l => !genericTerms.includes(l.toLowerCase())) || labels[1];

      // Extract size and quantity from detected text
      const sizeInfo = extractSizeFromText(text);
      const quantityInfo = extractQuantityFromText(text);

      console.log('📏 Size detected:', sizeInfo);
      console.log('🔢 Quantity detected:', quantityInfo);

      const productInfo: ProductInfo = {
        name: productName,
        brand: brandName,
        category: category,
        description: labels.slice(0, 5).join(', '),
        size: sizeInfo,
        quantity: quantityInfo,
      };

      console.log('✅ Product recognized:', productInfo);

      const stores = await searchStoresForProduct(productInfo);

      return {
        product: productInfo,
        stores: stores,
      };
    }

    console.warn('⚠️ No results from Vision API');
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
 * Extract size information from product text
 * Recognizes patterns like: 12 oz, 500ml, 1L, 2 liter, 16 fl oz, etc.
 */
function extractSizeFromText(text: string): string | undefined {
  const sizePatterns = [
    // Volume patterns
    /(\d+\.?\d*\s*(?:oz|ounce|ounces|fl oz|fluid ounce))/gi,
    /(\d+\.?\d*\s*(?:ml|milliliter|milliliters))/gi,
    /(\d+\.?\d*\s*(?:l|liter|liters|litre|litres))/gi,
    /(\d+\.?\d*\s*(?:gal|gallon|gallons))/gi,
    /(\d+\.?\d*\s*(?:pt|pint|pints))/gi,
    /(\d+\.?\d*\s*(?:qt|quart|quarts))/gi,

    // Weight patterns
    /(\d+\.?\d*\s*(?:lb|lbs|pound|pounds))/gi,
    /(\d+\.?\d*\s*(?:kg|kilogram|kilograms))/gi,
    /(\d+\.?\d*\s*(?:g|gram|grams))/gi,
    /(\d+\.?\d*\s*(?:mg|milligram|milligrams))/gi,

    // Count patterns
    /(\d+\s*(?:ct|count|pack|pk))/gi,
  ];

  for (const pattern of sizePatterns) {
    const match = text.match(pattern);
    if (match && match[0]) {
      return match[0].trim();
    }
  }

  return undefined;
}

/**
 * Extract quantity from product text or size string
 * Recognizes patterns like: 6 pack, 12 count, pack of 24, case of 12, etc.
 */
function extractQuantityFromText(text: string): number | undefined {
  if (!text) {
    return undefined;
  }

  const quantityPatterns = [
    // Pack patterns
    /(\d+)\s*(?:pack|pk|packs)/gi,
    /pack\s*of\s*(\d+)/gi,

    // Count patterns
    /(\d+)\s*(?:count|ct|piece|pieces)/gi,
    /(\d+)\s*(?:item|items)/gi,

    // Case patterns
    /case\s*of\s*(\d+)/gi,
    /(\d+)\s*(?:case|cases)/gi,

    // Box patterns
    /box\s*of\s*(\d+)/gi,
    /(\d+)\s*(?:box|boxes)/gi,

    // General patterns
    /(\d+)\s*(?:×|x|\/|per)/gi,
  ];

  for (const pattern of quantityPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const quantity = parseInt(match[1], 10);
      if (quantity > 0) {
        return quantity;
      }
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
