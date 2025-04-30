import { defineTable } from 'convex/server';
import { v } from 'convex/values';

const users = defineTable({
  userId: v.string(),
  taniId: v.number(),
  email: v.string(),
  name: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_email', ['email'])
  .index('by_name', ['name'])
  .index('by_user_id', ['userId']);

export default users;
