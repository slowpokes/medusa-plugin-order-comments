/* eslint-disable @medusajs/link-uses-linkable-properties -- The rule reports valid read-only field mappings and Medusa core package subpath imports in plugin packages. */
import { defineLink } from "@medusajs/framework/utils"
import OrderModule from "@medusajs/medusa/order"

import OrderCommentModule from "../modules/order-comment"

export default defineLink(
  {
    linkable: OrderCommentModule.linkable.orderComment.id,
    field: "order_id",
  },
  OrderModule.linkable.order.id,
  {
    readOnly: true,
  }
)
