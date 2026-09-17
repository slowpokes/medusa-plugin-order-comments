export type OrderComment = {
  id: string
  order_id: string
  content: string
  author_id: string
  author_email: string
  author_first_name: string | null
  author_last_name: string | null
  created_at: string
  updated_at: string
}

export type OrderCommentsResponse = {
  comments: OrderComment[]
}

export type CreateOrderCommentResponse = {
  comment: OrderComment
}
