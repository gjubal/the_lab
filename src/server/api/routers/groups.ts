import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.messengerGroup.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),
  getTotalOfGroups: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.messengerGroup.count({
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),
});
