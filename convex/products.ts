import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { requireAdmin, logActivity } from "./lib";

const productFields = {
  name: v.string(), slug: v.string(), sku: v.string(), category: v.string(),
  description: v.string(), price: v.number(), compareAtPrice: v.optional(v.number()),
  images: v.array(v.string()), featured: v.boolean(), stock: v.number(),
  lowStockAt: v.number(), tags: v.array(v.string())
};

export const list = query({
  args: { category: v.optional(v.string()), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const q = args.category
      ? ctx.db.query("products").withIndex("by_category_active", i => i.eq("category", args.category).eq("active", true))
      : ctx.db.query("products").withIndex("by_active_created", i => i.eq("active", true));
    return await q.order("desc").paginate(args.paginationOpts);
  }
});

export const featured = query({
  args: {},
  handler: async ctx => ctx.db.query("products")
    .withIndex("by_featured_active", q => q.eq("featured", true).eq("active", true))
    .take(8)
});

export const adminList = query({
  args: { paginationOpts: paginationOptsValidator, category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const q = args.category
      ? ctx.db.query("products").withIndex("by_category_active", i => i.eq("category", args.category))
      : ctx.db.query("products");
    return await q.order("desc").paginate(args.paginationOpts);
  }
});

export const create = mutation({
  args: productFields,
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);
    if (args.price <= 0 || args.stock < 0) throw new Error("Invalid price or stock");
    const duplicate = await ctx.db.query("products").withIndex("by_sku", q => q.eq("sku", args.sku)).unique();
    if (duplicate) throw new Error("SKU already exists");
    const now = Date.now();
    const id = await ctx.db.insert("products", {...args, active: true, createdAt: now, updatedAt: now});
    if (args.stock) await ctx.db.insert("inventoryMovements", {productId:id,change:args.stock,reason:"Initial stock",actor:identity.subject,createdAt:now});
    await logActivity(ctx, identity.subject, "product.created", "products", id, {sku:args.sku});
    return id;
  }
});

export const update = mutation({
  args: { id: v.id("products"), patch: v.object({
    name:v.optional(v.string()), slug:v.optional(v.string()), sku:v.optional(v.string()),
    category:v.optional(v.string()), description:v.optional(v.string()), price:v.optional(v.number()),
    compareAtPrice:v.optional(v.number()), images:v.optional(v.array(v.string())),
    active:v.optional(v.boolean()), featured:v.optional(v.boolean()),
    stock:v.optional(v.number()), lowStockAt:v.optional(v.number()), tags:v.optional(v.array(v.string()))
  })},
  handler: async (ctx, {id,patch}) => {
    const {identity}=await requireAdmin(ctx);
    const current=await ctx.db.get(id); if(!current) throw new Error("Product not found");
    if(patch.price!==undefined && patch.price<=0) throw new Error("Price must be positive");
    if(patch.stock!==undefined && patch.stock<0) throw new Error("Stock cannot be negative");
    if(patch.sku && patch.sku!==current.sku) {
      const duplicate=await ctx.db.query("products").withIndex("by_sku",q=>q.eq("sku",patch.sku)).unique();
      if(duplicate) throw new Error("SKU already exists");
    }
    if(patch.stock!==undefined && patch.stock!==current.stock) await ctx.db.insert("inventoryMovements",{productId:id,change:patch.stock-current.stock,reason:"Manual stock adjustment",actor:identity.subject,createdAt:Date.now()});
    await ctx.db.patch(id,{...patch,updatedAt:Date.now()});
    await logActivity(ctx,identity.subject,"product.updated","products",id,patch);
    return id;
  }
});

export const remove = mutation({
  args:{id:v.id("products")},
  handler:async(ctx,{id})=>{
    const {identity}=await requireAdmin(ctx);
    const product=await ctx.db.get(id); if(!product) return false;
    await ctx.db.patch(id,{active:false,updatedAt:Date.now()});
    await logActivity(ctx,identity.subject,"product.archived","products",id,{sku:product.sku});
    return true;
  }
});