import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import type { CreateOrderCommentInput } from "../types/order-comment"
import { createOrderCommentStep } from "./steps/create-order-comment"

export const createOrderCommentWorkflow = createWorkflow(
  "create-order-comment",
  (input: CreateOrderCommentInput) => {
    const comment = createOrderCommentStep(input)

    return new WorkflowResponse({ comment })
  }
)
