import { MedusaService } from "@medusajs/framework/utils"

import { OrderComment } from "./models/order-comment"

class OrderCommentModuleService extends MedusaService({
  OrderComment,
}) {}

export default OrderCommentModuleService
