import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { requireAdmin, logActivity } from "./lib";

export const submitLead = mutation({
  args:{name:v.string(),email:v.string(),phone:v.optional(v.string()),message:v.optional(v.string()),source:v.optional(v.string())},
  handler:async(ctx,args)=>{
    const now=Date.now();
    return await ctx.db.insert("leads",{...args,source:args.source??"website",status:"New",createdAt:now,updatedAt:now});
  }
});

export const subscribe = mutation({
  args:{email:v.string()},
  handler:async(ctx,{email})=>{
    const normalized=email.trim().toLowerCase();
    const existing=await ctx.db.query("newsletter").withIndex("by_email",q=>q.eq("email",normalized)).unique();
    if(existing){await ctx.db.patch(existing._id,{active:true});return existing._id;}
    return await ctx.db.insert("newsletter",{email:normalized,subscribedAt:Date.now(),active:true});
  }
});

export const adminLeads = query({
  args:{paginationOpts:paginationOptsValidator,status:v.optional(v.string())},
  handler:async(ctx,args)=>{
    await requireAdmin(ctx);
    const q=args.status?ctx.db.query("leads").withIndex("by_status_created",i=>i.eq("status",args.status)):ctx.db.query("leads");
    return await q.order("desc").paginate(args.paginationOpts);
  }
});

export const updateLead = mutation({
  args:{id:v.id("leads"),status:v.string(),assignedTo:v.optional(v.string())},
  handler:async(ctx,args)=>{
    const {identity}=await requireAdmin(ctx);
    await ctx.db.patch(args.id,{status:args.status,assignedTo:args.assignedTo,updatedAt:Date.now()});
    await logActivity(ctx,identity.subject,"lead.updated","leads",args.id,{status:args.status});
  }
});

export const adminOrders = query({
  args:{paginationOpts:paginationOptsValidator,status:v.optional(v.string())},
  handler:async(ctx,args)=>{
    await requireAdmin(ctx);
    const q=args.status?ctx.db.query("orders").withIndex("by_status_created",i=>i.eq("status",args.status)):ctx.db.query("orders");
    return await q.order("desc").paginate(args.paginationOpts);
  }
});

export const updateOrderStatus = mutation({
  args:{id:v.id("orders"),status:v.string()},
  handler:async(ctx,{id,status})=>{
    const {identity}=await requireAdmin(ctx);
    const allowed=["Processing","Confirmed","Packed","Shipped","Delivered","Cancelled"];
    if(!allowed.includes(status)) throw new Error("Invalid order status");
    await ctx.db.patch(id,{status,updatedAt:Date.now()});
    await logActivity(ctx,identity.subject,"order.status_changed","orders",id,{status});
  }
});

export const adminCustomers = query({
  args:{paginationOpts:paginationOptsValidator},
  handler:async(ctx,args)=>{
    await requireAdmin(ctx);
    return await ctx.db.query("customers").order("desc").paginate(args.paginationOpts);
  }
});

export const inventoryHistory = query({
  args:{productId:v.id("products"),paginationOpts:paginationOptsValidator},
  handler:async(ctx,args)=>{
    await requireAdmin(ctx);
    return await ctx.db.query("inventoryMovements").withIndex("by_product_created",q=>q.eq("productId",args.productId)).order("desc").paginate(args.paginationOpts);
  }
});

export const dashboardSummary = query({
  args:{},
  handler:async(ctx)=>{
    await requireAdmin(ctx);
    const [lowStock, recentOrders, recentLeads] = await Promise.all([
      ctx.db.query("products").withIndex("by_active_created",q=>q.eq("active",true)).take(500),
      ctx.db.query("orders").withIndex("by_created").order("desc").take(10),
      ctx.db.query("leads").withIndex("by_status_created").order("desc").take(10)
    ]);
    return {activeProducts:lowStock.length,lowStockProducts:lowStock.filter(p=>p.stock<=p.lowStockAt).length,recentOrders,recentLeads};
  }
});