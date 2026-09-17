import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

import { ORDER_COMMENT_MODULE } from ".."
import { OrderComment } from "../models/order-comment"
import OrderCommentModuleService from "../service"

moduleIntegrationTestRunner<OrderCommentModuleService>({
  moduleName: ORDER_COMMENT_MODULE,
  moduleModels: [OrderComment],
  resolve: "./src/modules/order-comment",
  testSuite: ({ service }) => {
    describe("OrderCommentModuleService", () => {
      it("stores comments and lists the newest comment first", async () => {
        await service.createOrderComments([
          {
            order_id: "order_01",
            content: "First comment",
            author_id: "user_01",
            author_email: "admin@example.com",
            author_first_name: "Ada",
            author_last_name: "Lovelace",
          },
          {
            order_id: "order_01",
            content: "Second comment",
            author_id: "user_02",
            author_email: "ops@example.com",
            author_first_name: null,
            author_last_name: null,
          },
        ])

        const comments = await service.listOrderComments(
          { order_id: "order_01" },
          { order: { created_at: "DESC" } }
        )

        expect(comments).toHaveLength(2)
        expect(comments.map((comment) => comment.content)).toEqual([
          "Second comment",
          "First comment",
        ])
      })
    })
  },
})

jest.setTimeout(60_000)
