export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueSlug(base: string, existing: string[]) {
  let slug = slugify(base)
  if (!slug) {
    slug = 'item'
  }

  if (!existing.includes(slug)) {
    return slug
  }

  let index = 2
  while (existing.includes(`${slug}-${index}`)) {
    index += 1
  }

  return `${slug}-${index}`
}
