/* eslint-disable @medusajs/link-uses-linkable-properties -- The rule reports valid read-only field mappings and Medusa core package subpath imports in plugin packages. */
import { defineLink } from "@medusajs/framework/utils"
import UserModule from "@medusajs/medusa/user"

import OrderCommentModule from "../modules/order-comment"

export default defineLink(
  {
    linkable: OrderCommentModule.linkable.orderComment.id,
    field: "author_id",
  },
  UserModule.linkable.user.id,
  {
    readOnly: true,
  }
)
