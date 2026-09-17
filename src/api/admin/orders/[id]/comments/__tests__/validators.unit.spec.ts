import { PostAdminCreateOrderComment } from "../validators"

describe("order comment validation", () => {
  it("trims a valid comment", () => {
    const result = PostAdminCreateOrderComment.parse({
      content: "  Call the customer before shipping.  ",
    })

    expect(result.content).toBe("Call the customer before shipping.")
  })

  it("rejects a whitespace-only comment", () => {
    expect(() =>
      PostAdminCreateOrderComment.parse({ content: "   " })
    ).toThrow("Comment cannot be empty")
  })

  it("rejects a comment longer than 5000 characters", () => {
    expect(() =>
      PostAdminCreateOrderComment.parse({ content: "a".repeat(5001) })
    ).toThrow("Comment cannot exceed 5000 characters")
  })
})
