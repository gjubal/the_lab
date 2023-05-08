import { TRPCError } from "@trpc/server";
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
  create: privateProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        groupName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.groupName) {
        return ctx.prisma.messenger.create({
          data: {
            username: input.username,
            password: input.password,
            status: "Inactive",
            userId: ctx.auth.userId,
          },
        });
      }

      const group = await ctx.prisma.messengerGroup.findUnique({
        where: {
          name: input.groupName,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Group name provided does not correspond to any existing group",
        });
      }

      return ctx.prisma.messenger.create({
        data: {
          username: input.username,
          password: input.password,
          status: "Inactive",
          userId: ctx.auth.userId,
          messengerGroups: {
            connect: {
              id: group.id,
            },
          },
        },
      });
    }),
});
