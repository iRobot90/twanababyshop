import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeProduct = (product: any) => {
  const title = product?.title || product?.name || "Untitled product";
  const slug =
    product?.slug ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") ||
    `product-${product?.id}`;
  const categoryValue = product?.category;
  const categoryName =
    typeof categoryValue === "string"
      ? categoryValue
      : categoryValue?.name || "General";
  const categorySlug =
    typeof categoryValue === "string"
      ? categoryValue
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") || "general"
      : categoryValue?.slug ||
        categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") ||
        "general";

  return {
    ...product,
    id: product?.id,
    name: title,
    slug,
    price: Number(product?.price ?? 0),
    image:
      product?.image ||
      (Array.isArray(product?.image_url)
        ? product.image_url[0]
        : product?.image_url || ""),
    description: product?.description || "",
    category: {
      name: categoryName,
      slug: categorySlug,
    },
    stock_quantity: Number(product?.stock_quantity ?? 0),
    is_active: product?.is_active ?? true,
  };
};

export const fetchProducts = async (params?: {
  category?: string;
  search?: string;
  ordering?: string;
}) => {
  try {
    const response = await api.get("/api/products", {
      params: {
        category: params?.category,
        search: params?.search,
        ordering: params?.ordering,
      },
    });

    const payload = response.data;
    const products = Array.isArray(payload)
      ? payload
      : payload?.products || payload?.results || [];

    return (Array.isArray(products) ? products : []).map(normalizeProduct);
  } catch (error) {
    throw error;
  }
};

export const fetchProduct = async (slug: string) => {
  const response = await api.get("/api/products", {
    params: { slug },
  });

  const payload = response.data;
  const products = Array.isArray(payload)
    ? payload
    : payload?.products || payload?.results || [];
  const normalized = (Array.isArray(products) ? products : []).map(
    normalizeProduct,
  );

  return normalized.find((product) => product.slug === slug) || null;
};

export const fetchCategories = async () => {
  const products = await fetchProducts();
  const categories = new Map<
    string,
    { id: string; name: string; slug: string; image: string }
  >();
  for (const product of products) {
    const category = product.category;
    const current = categories.get(category.slug);
    if (!current || (!current.image && product.image))
      categories.set(category.slug, {
        id: category.slug,
        ...category,
        image: product.image,
      });
  }
  return [...categories.values()];
};
