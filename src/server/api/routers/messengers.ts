import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const messengersRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.messenger.findMany({
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),
  deleteById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.messenger.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
