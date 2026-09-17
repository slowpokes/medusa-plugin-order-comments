import {
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"

import {
  ORDER_COMMENT_MODULE,
} from "../../modules/order-comment"
import OrderCommentModuleService from "../../modules/order-comment/service"
import type { CreateOrderCommentInput } from "../../types/order-comment"

export const createOrderCommentStep = createStep(
  "create-order-comment",
  async (input: CreateOrderCommentInput, { container }) => {
    const orderCommentService =
      container.resolve<OrderCommentModuleService>(ORDER_COMMENT_MODULE)
    const comment = await orderCommentService.createOrderComments(input)

    return new StepResponse(comment, comment.id)
  },
  async (commentId, { container }) => {
    if (!commentId) {
      return
    }

    const orderCommentService =
      container.resolve<OrderCommentModuleService>(ORDER_COMMENT_MODULE)

    await orderCommentService.deleteOrderComments(commentId)
  }
)
