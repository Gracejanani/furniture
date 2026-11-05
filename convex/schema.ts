import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(), slug: v.string(), sku: v.string(), category: v.string(),
    description: v.string(), price: v.number(), compareAtPrice: v.optional(v.number()),
    images: v.array(v.string()), active: v.boolean(), featured: v.boolean(),
    stock: v.number(), lowStockAt: v.number(), tags: v.array(v.string()),
    createdAt: v.number(), updatedAt: v.number()
  }).index("by_slug", ["slug"]).index("by_sku", ["sku"])
    .index("by_category_active", ["category", "active"])
    .index("by_active_created", ["active", "createdAt"])
    .index("by_featured_active", ["featured", "active"]),
  customers: defineTable({
    name: v.string(), email: v.string(), phone: v.optional(v.string()),
    authSubject: v.optional(v.string()), createdAt: v.number(), updatedAt: v.number()
  }).index("by_email", ["email"]).index("by_auth_subject", ["authSubject"]),
  addresses: defineTable({
    customerId: v.id("customers"), label: v.string(), name: v.string(),
    phone: v.string(), line1: v.string(), line2: v.optional(v.string()),
    city: v.string(), state: v.string(), postalCode: v.string(), country: v.string(),
    isDefault: v.boolean()
  }).index("by_customer", ["customerId"]),
  orders: defineTable({
    orderNumber: v.string(), customerId: v.id("customers"), status: v.string(),
    paymentStatus: v.string(), paymentProvider: v.optional(v.string()),
    paymentReference: v.optional(v.string()), subtotal: v.number(),
    discount: v.number(), shipping: v.number(), total: v.number(),
    currency: v.string(), shippingAddress: v.any(), notes: v.optional(v.string()),
    createdAt: v.number(), updatedAt: v.number()
  }).index("by_order_number", ["orderNumber"])
    .index("by_customer_created", ["customerId", "createdAt"])
    .index("by_status_created", ["status", "createdAt"])
    .index("by_created", ["createdAt"]),
  orderItems: defineTable({
    orderId: v.id("orders"), productId: v.id("products"), name: v.string(),
    sku: v.string(), unitPrice: v.number(), quantity: v.number(), lineTotal: v.number()
  }).index("by_order", ["orderId"]),
  inventoryMovements: defineTable({
    productId: v.id("products"), change: v.number(), reason: v.string(),
    reference: v.optional(v.string()), actor: v.string(), createdAt: v.number()
  }).index("by_product_created", ["productId", "createdAt"]),
  leads: defineTable({
    name: v.string(), email: v.string(), phone: v.optional(v.string()),
    message: v.optional(v.string()), source: v.string(), status: v.string(),
    assignedTo: v.optional(v.string()), createdAt: v.number(), updatedAt: v.number()
  }).index("by_email", ["email"]).index("by_status_created", ["status", "createdAt"]),
  newsletter: defineTable({
    email: v.string(), subscribedAt: v.number(), active: v.boolean()
  }).index("by_email", ["email"]),
  admins: defineTable({
    authSubject: v.string(), email: v.string(), role: v.string(),
    active: v.boolean(), createdAt: v.number()
  }).index("by_auth_subject", ["authSubject"]).index("by_email", ["email"]),
  content: defineTable({
    key: v.string(), title: v.string(), body: v.string(), status: v.string(),
    seoTitle: v.optional(v.string()), seoDescription: v.optional(v.string()),
    updatedAt: v.number(), updatedBy: v.string()
  }).index("by_key", ["key"]).index("by_status", ["status"]),
  coupons: defineTable({
    code: v.string(), kind: v.string(), value: v.number(), minOrder: v.number(),
    maxUses: v.optional(v.number()), uses: v.number(), active: v.boolean(),
    startsAt: v.optional(v.number()), expiresAt: v.optional(v.number())
  }).index("by_code", ["code"]),
  activityLogs: defineTable({
    actor: v.string(), action: v.string(), entity: v.string(),
    entityId: v.string(), metadata: v.optional(v.any()), createdAt: v.number()
  }).index("by_created", ["createdAt"]).index("by_entity", ["entity", "entityId"])
});