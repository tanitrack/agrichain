import { v } from 'convex/values';
import { httpAction, internalQuery } from './_generated/server';
import { internal } from './_generated/api';
import { corsHeaders } from './corsHeaders';

export const getUserByTaniId = internalQuery({
  args: { taniId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_tani_id', (q) => q.eq('taniId', args.taniId))
      .unique();
  },
});

export const taniIdLoginHttpHandler = httpAction(async (ctx, request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  if (request.method === 'POST') {
    const jsonRequest = await request.json();

    if (!jsonRequest) {
      throw new Error('No body provided');
    }

    if (!jsonRequest.taniId) {
      throw new Error('No taniId provided');
    }

    const taniId = Number(jsonRequest.taniId);

    const user = await ctx.runQuery(internal.users.getUserByTaniId, { taniId });

    if (!user) {
      throw new Error('User not found');
    }

    return new Response(JSON.stringify(user), {
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify({ error: 'Invalid request method' }), {
    status: 405,
    headers: corsHeaders,
  });
});
