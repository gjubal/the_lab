import { createTRPCRouter } from "~/server/api/trpc";
import { messengersRouter } from "./routers/messengers";
import { groupsRouter } from "./routers/groups";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  messengers: messengersRouter,
  groups: groupsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
