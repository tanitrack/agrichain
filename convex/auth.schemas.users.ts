import { defineTable } from 'convex/server';
import { v } from 'convex/values';

const users = defineTable({
  userId: v.string(),
  taniId: v.number(),
  email: v.string(),
  name: v.string(),
  phone: v.string(),
  address: v.string(),
  nationalIdNumber: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
  userType: v.union(v.literal('farmer'), v.literal('consumer')),
})
  .index('by_email', ['email'])
  .index('by_name', ['name'])
  .index('by_user_id', ['userId'])
  .index('by_tani_id', ['taniId']);

export default users;
