import type {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

import {
  ORDER_COMMENT_MODULE,
} from "../../../../../modules/order-comment"
import OrderCommentModuleService from "../../../../../modules/order-comment/service"
import { createOrderCommentWorkflow } from "../../../../../workflows/create-order-comment"
import type { PostAdminCreateOrderCommentType } from "./validators"

type AdminUser = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

const ensureOrderExists = async (
  req: AuthenticatedMedusaRequest,
  orderId: string
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "order",
    fields: ["id"],
    filters: { id: orderId },
  })

  if (!data.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Order with ID ${orderId} was not found`
    )
  }
}

const retrieveAdminUser = async (
  req: AuthenticatedMedusaRequest,
  userId: string
): Promise<AdminUser> => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "user",
    fields: ["id", "email", "first_name", "last_name"],
    filters: { id: userId },
  })

  const user = data[0] as AdminUser | undefined

  if (!user) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Admin user with ID ${userId} was not found`
    )
  }

  return user
}

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const orderId = req.params.id

  await ensureOrderExists(req, orderId)

  const orderCommentService =
    req.scope.resolve<OrderCommentModuleService>(ORDER_COMMENT_MODULE)
  const comments = await orderCommentService.listOrderComments(
    { order_id: orderId },
    { order: { created_at: "DESC" } }
  )

  res.json({ comments })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<PostAdminCreateOrderCommentType>,
  res: MedusaResponse
) => {
  const authorId = req.auth_context?.actor_id

  if (!authorId) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      "An authenticated admin user is required"
    )
  }

  const [user] = await Promise.all([
    retrieveAdminUser(req, authorId),
    ensureOrderExists(req, req.params.id),
  ])
  const { result } = await createOrderCommentWorkflow(req.scope).run({
    input: {
      order_id: req.params.id,
      content: req.validatedBody.content,
      author_id: user.id,
      author_email: user.email,
      author_first_name: user.first_name,
      author_last_name: user.last_name,
    },
  })

  res.status(201).json({ comment: result.comment })
}
