import { QueryCtx, MutationCtx } from "./_generated/server";

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Authentication required");
  const admin = await ctx.db.query("admins")
    .withIndex("by_auth_subject", q => q.eq("authSubject", identity.subject))
    .unique();
  if (!admin || !admin.active) throw new Error("Administrator access required");
  return { identity, admin };
}

export async function logActivity(ctx: MutationCtx, actor: string, action: string, entity: string, entityId: string, metadata?: unknown) {
  await ctx.db.insert("activityLogs", {
    actor, action, entity, entityId, metadata, createdAt: Date.now()
  });
}