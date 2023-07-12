import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const groupsRouter = createTRPCRouter({
  getAll: privateProcedure
    .input(
      z
        .object({
          includeMessengers: z.boolean(),
        })
        .optional()
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.messengerGroup.findMany({
        where: {
          userId: ctx.auth.userId,
        },
        include: {
          messengers: input?.includeMessengers,
        },
      });
    }),
  getGroupById: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.messengerGroup.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messengers: true,
        },
      });
    }),
  getMessengerTotalByGroupId: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const group = await ctx.prisma.messengerGroup.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messengers: true,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `A group with the ID provided does not exist.`,
        });
      }

      return group.messengers.length;
    }),
  create: privateProcedure
    .input(
      z.object({
        name: z.string(),
        messengersIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingGroup = await ctx.prisma.messengerGroup.findUnique({
        where: {
          name: input.name,
        },
      });

      if (existingGroup) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `A group with the name provided already exists.`,
        });
      }

      return ctx.prisma.messengerGroup.create({
        data: {
          name: input.name,
          userId: ctx.auth.userId,
          messengers: {
            connect: input.messengersIds.map((id) => ({ id })),
          },
        },
      });
    }),
  update: privateProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        messengersIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingGroup = await ctx.prisma.messengerGroup.findUnique({
        where: {
          id: input.id,
        },
        include: {
          messengers: true,
        },
      });

      if (!existingGroup) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "A group with the ID provided does not exist.",
        });
      }
      await ctx.prisma.messengerGroup.update({
        where: {
          id: input.id,
        },
        data: {
          messengers: {
            disconnect: existingGroup.messengers.map((messenger) => ({
              id: messenger.id,
            })),
          },
        },
      });

      return ctx.prisma.messengerGroup.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          messengers: {
            connect: input.messengersIds.map((id) => ({ id })),
          },
        },
      });
    }),
  delete: privateProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.messengerGroup.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
