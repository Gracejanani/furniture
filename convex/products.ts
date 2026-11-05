import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: { category: v.optional(v.string()), limit: v.optional(v.number()) },
  returns: v.array(v.object({
    _id: v.id("products"), name: v.string(), slug: v.string(), category: v.string(),
    description: v.string(), price: v.number(), compareAtPrice: v.union(v.number(), v.null()),
    image: v.string(), active: v.boolean(), featured: v.boolean()
  })),
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 24, 1), 50);
    const rows = args.category
      ? await ctx.db.query("products").withIndex("by_category", q => q.eq("category", args.category)).take(limit)
      : await ctx.db.query("products").withIndex("by_active", q => q.eq("active", true)).take(limit);
    return rows.filter(p => p.active).map(p => ({...p, compareAtPrice: p.compareAtPrice ?? null}));
  }
});

export const create = mutation({
  args: {
    name: v.string(), slug: v.string(), category: v.string(), description: v.string(),
    price: v.number(), image: v.string(), featured: v.boolean()
  },
  returns: v.id("products"),
  handler: async (ctx, args) => ctx.db.insert("products", {...args, active: true})
});