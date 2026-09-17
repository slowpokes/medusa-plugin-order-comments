import { Module } from "@medusajs/framework/utils"

import OrderCommentModuleService from "./service"

export const ORDER_COMMENT_MODULE = "orderComment"

export default Module(ORDER_COMMENT_MODULE, {
  service: OrderCommentModuleService,
})
