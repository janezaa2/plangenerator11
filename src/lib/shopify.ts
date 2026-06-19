const SHOPIFY_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN || "0g1vap-z9.myshopify.com";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN || "";

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

async function storefrontQuery(query: string, variables?: Record<string, any>) {
  const res = await fetch(STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          descriptionHtml
          handle
          tags
          productType
          priceRange {
            minVariantPrice { amount currencyCode }
            maxVariantPrice { amount currencyCode }
          }
          compareAtPriceRange {
            minVariantPrice { amount currencyCode }
          }
          images(first: 5) {
            edges { node { url altText } }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                sku
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
                availableForSale
                quantityAvailable
              }
            }
          }
          metafields(identifiers: [
            { namespace: "nutrition", key: "calories" }
            { namespace: "nutrition", key: "protein" }
            { namespace: "nutrition", key: "carbs" }
            { namespace: "nutrition", key: "fat" }
          ]) {
            key namespace value
          }
        }
      }
    }
  }
`;

export interface ShopifyProduct {
  shopifyId: string;
  handle: string;
  name: string;
  description: string;
  category: string;
  price: number;
  comparePrice?: number;
  images: string[];
  supplierSku: string;
  supplierPrice: number;
  stock: number;
  tags: string[];
  nutritionInfo: { calories?: number; protein?: number; carbs?: number; fat?: number };
  isActive: boolean;
  rating: number;
  reviewCount: number;
}

function mapProductType(type: string, tags: string[]): string {
  const t = (type || "").toLowerCase();
  const allTags = tags.map((x) => x.toLowerCase()).join(" ");

  if (t.includes("protein") || allTags.includes("protein")) return "protein";
  if (t.includes("vitamin") || allTags.includes("vitamin") || allTags.includes("supplement")) return "vitamins";
  if (t.includes("snack") || allTags.includes("snack")) return "healthy_snacks";
  if (t.includes("kitchen") || allTags.includes("kitchen")) return "kitchen_equipment";
  if (t.includes("fitness") || allTags.includes("fitness") || allTags.includes("gym")) return "fitness_accessories";
  if (t.includes("device") || allTags.includes("smart") || allTags.includes("tracker")) return "smart_devices";
  return "vitamins";
}

export async function fetchAllShopifyProducts(): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  let cursor: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const data = await storefrontQuery(PRODUCTS_QUERY, { first: 50, after: cursor });
    const { edges, pageInfo } = data.products;

    for (const { node } of edges) {
      const firstVariant = node.variants.edges[0]?.node;
      const price = parseFloat(firstVariant?.price?.amount || node.priceRange.minVariantPrice.amount);
      const compareAt = parseFloat(
        firstVariant?.compareAtPrice?.amount ||
        node.compareAtPriceRange?.minVariantPrice?.amount || "0"
      );
      const images = node.images.edges.map((e: any) => e.node.url);
      const meta = Object.fromEntries(
        (node.metafields || []).filter(Boolean).map((m: any) => [m.key, parseFloat(m.value)])
      );

      products.push({
        shopifyId: node.id,
        handle: node.handle,
        name: node.title,
        description: node.descriptionHtml.replace(/<[^>]+>/g, "").trim(),
        category: mapProductType(node.productType, node.tags),
        price,
        comparePrice: compareAt > 0 ? compareAt : undefined,
        images,
        supplierSku: firstVariant?.sku || node.handle,
        supplierPrice: price * 0.6,
        stock: node.variants.edges.reduce(
          (sum: number, e: any) => sum + (e.node.quantityAvailable || 0),
          0
        ),
        tags: node.tags,
        nutritionInfo: {
          calories: meta.calories,
          protein: meta.protein,
          carbs: meta.carbs,
          fat: meta.fat,
        },
        isActive: true,
        rating: 0,
        reviewCount: 0,
      });
    }

    hasNext = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return products;
}
