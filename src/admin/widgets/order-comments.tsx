import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type {
  DetailWidgetProps,
  HttpTypes,
} from "@medusajs/framework/types"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import {
  Button,
  Container,
  Heading,
  Label,
  Text,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FormEvent, useState } from "react"

import { sdk } from "../lib/sdk"
import type {
  CreateOrderCommentResponse,
  OrderComment,
  OrderCommentsResponse,
} from "../types/order-comment"

const MAX_COMMENT_LENGTH = 5000

const getAuthorName = (comment: OrderComment) => {
  const fullName = [comment.author_first_name, comment.author_last_name]
    .filter(Boolean)
    .join(" ")

  return fullName || comment.author_email
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return "The comment could not be added"
}

const CommentItem = ({
  comment,
  isLatest,
}: {
  comment: OrderComment
  isLatest: boolean
}) => (
  <li className="flex flex-col gap-y-2 px-6 py-4">
    <div className="flex items-start justify-between gap-x-3">
      <div className="min-w-0">
        <div className="flex items-center gap-x-2">
          <Text size="small" weight="plus" className="truncate">
            {getAuthorName(comment)}
          </Text>
          {isLatest && (
            <Text size="xsmall" className="text-ui-fg-muted">
              Latest
            </Text>
          )}
        </div>
        {getAuthorName(comment) !== comment.author_email && (
          <Text size="xsmall" className="text-ui-fg-subtle truncate">
            {comment.author_email}
          </Text>
        )}
      </div>
      <Text
        size="xsmall"
        className="text-ui-fg-muted shrink-0"
        title={new Date(comment.created_at).toISOString()}
      >
        {new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(new Date(comment.created_at))}
      </Text>
    </div>
    <Text size="small" className="whitespace-pre-wrap break-words">
      {comment.content}
    </Text>
  </li>
)

const OrderCommentsWidget = ({
  data: order,
}: DetailWidgetProps<HttpTypes.AdminOrder>) => {
  const queryClient = useQueryClient()
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [content, setContent] = useState("")
  const queryKey = ["order-comments", order.id]

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      sdk.client.fetch<OrderCommentsResponse>(
        `/admin/orders/${order.id}/comments`
      ),
  })

  const createComment = useMutation({
    mutationFn: (comment: string) =>
      sdk.client.fetch<CreateOrderCommentResponse>(
        `/admin/orders/${order.id}/comments`,
        {
          method: "POST",
          body: { content: comment },
        }
      ),
    onSuccess: async () => {
      setContent("")
      setIsEditorOpen(false)
      await queryClient.invalidateQueries({ queryKey })
      toast.success("Comment added")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    },
  })

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedContent = content.trim()

    if (!trimmedContent) {
      return
    }

    createComment.mutate(trimmedContent)
  }

  const comments = data?.comments ?? []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between gap-x-4 px-6 py-4">
        <div className="flex items-center gap-x-2">
          <ChatBubbleLeftRight className="text-ui-fg-subtle" />
          <Heading level="h2">Order comments</Heading>
        </div>
        <Button
          size="small"
          variant="secondary"
          onClick={() => setIsEditorOpen((isOpen) => !isOpen)}
        >
          {isEditorOpen ? "Cancel" : "Add comment"}
        </Button>
      </div>

      {isEditorOpen && (
        <form className="flex flex-col gap-y-3 px-6 py-4" onSubmit={submitComment}>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between gap-x-2">
              <Label htmlFor="order-comment-content">Comment</Label>
              <Text size="xsmall" className="text-ui-fg-muted">
                {content.length}/{MAX_COMMENT_LENGTH}
              </Text>
            </div>
            <Textarea
              id="order-comment-content"
              value={content}
              maxLength={MAX_COMMENT_LENGTH}
              rows={5}
              autoFocus
              placeholder="Add an internal note about this order..."
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              size="small"
              type="submit"
              isLoading={createComment.isPending}
              disabled={!content.trim()}
            >
              Save comment
            </Button>
          </div>
        </form>
      )}

      {isLoading && (
        <Text size="small" className="text-ui-fg-muted px-6 py-4">
          Loading comments...
        </Text>
      )}

      {isError && (
        <Text size="small" className="text-ui-fg-error px-6 py-4">
          Comments could not be loaded.
        </Text>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <Text size="small" className="text-ui-fg-muted px-6 py-4">
          No comments have been added to this order yet.
        </Text>
      )}

      {comments.length > 0 && (
        <ol className="divide-y">
          {comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isLatest={index === 0}
            />
          ))}
        </ol>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side",
  id: "medusa-plugin-order-comments:order-comments",
})

export default OrderCommentsWidget
