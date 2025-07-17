export function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);
  return {
    items: paginatedItems,
    meta: {
      totalItems: items.length,
      itemCount: paginatedItems.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(items.length / limit),
      currentPage: page,
    },
  };
}
