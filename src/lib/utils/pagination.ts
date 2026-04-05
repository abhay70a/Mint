export interface PaginationParams {
  page?: number
  perPage?: number
}

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    page: number
    perPage: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export function paginate(params: PaginationParams) {
  const page = Math.max(1, Number(params.page) || 1)
  const perPage = Math.min(100, Math.max(1, Number(params.perPage) || 20))
  
  return {
    skip: (page - 1) * perPage,
    take: perPage,
    page,
    perPage,
  }
}
