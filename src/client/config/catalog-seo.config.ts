// Product has no draft/published flag. Only explicitly reviewed slugs may be indexed.
// Keep empty until real products, descriptions and photos have been approved.
// A future database publication flag should replace this temporary allowlist.
export const reviewedProductSlugs: readonly string[] = []
