import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
  args: { name: v.string(), email: v.string(), phone: v.optional(v.string()), message: v.optional(v.string()) },
  returns: v.id("leads"),
  handler: async (ctx, args) => ctx.db.insert("leads", {...args, source: "website"})
});

export const subscribe = mutation({
  args: { email: v.string() },
  returns: v.id("newsletter"),
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("newsletter").withIndex("by_email", q => q.eq("email", args.email)).first();
    if (existing) return existing._id;
    return ctx.db.insert("newsletter", {email: args.email, subscribedAt: Date.now()});
  }
});