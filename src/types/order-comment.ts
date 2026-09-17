export type CreateOrderCommentInput = {
  order_id: string
  content: string
  author_id: string
  author_email: string
  author_first_name: string | null
  author_last_name: string | null
}

export type OrderCommentDTO = CreateOrderCommentInput & {
  id: string
  created_at: string
  updated_at: string
}
