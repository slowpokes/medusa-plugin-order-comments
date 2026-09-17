import { model } from "@medusajs/framework/utils"

export const OrderComment = model.define("order_comment", {
  id: model.id().primaryKey(),
  order_id: model.text(),
  content: model.text(),
  author_id: model.text().index("IDX_order_comment_author_id"),
  author_email: model.text(),
  author_first_name: model.text().nullable(),
  author_last_name: model.text().nullable(),
})
.indexes([
  {
    name: "IDX_order_comment_order_created_at",
    on: ["order_id", "created_at"],
  },
])
