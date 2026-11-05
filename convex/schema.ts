import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.string(),
    description: v.string(),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    image: v.string(),
    active: v.boolean(),
    featured: v.boolean()
  }).index("by_category", ["category"]).index("by_slug", ["slug"]).index("by_active", ["active"]),
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.optional(v.string()),
    source: v.string()
  }).index("by_email", ["email"]),
  newsletter: defineTable({
    email: v.string(),
    subscribedAt: v.number()
  }).index("by_email", ["email"])
});