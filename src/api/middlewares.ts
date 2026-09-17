import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"

import { PostAdminCreateOrderComment } from "./admin/orders/[id]/comments/validators"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/orders/:id/comments",
      method: "POST",
      middlewares: [
        validateAndTransformBody(PostAdminCreateOrderComment),
      ],
    },
  ],
})
