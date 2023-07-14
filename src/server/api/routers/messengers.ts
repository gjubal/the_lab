import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { readRowsFromFile } from "../../../utils/readRowsFromFile";
import { type Messenger } from "@prisma/client";

export const messengerSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const messengersRouter = createTRPCRouter({
  getAll: privateProcedure.query(({ ctx }) => {
    return ctx.prisma.messenger.findMany({
      where: {
        userId: ctx.auth.userId,
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
  bulkCreate: privateProcedure
    .input(
      z.object({
        fileContent: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const group = await ctx.prisma.messengerGroup.findUnique({
        where: {
          id: input.groupId,
        },
      });

      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Group provided does not correspond to any existing group",
        });
      }

      if (!input.fileContent) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File must be uploaded to bulk create messengers",
        });
      }

      const rows = readRowsFromFile(input.fileContent);
      let createdMessengers: Messenger[] = [];

      for (const row of rows) {
        const createdMessenger = await ctx.prisma.messenger.create({
          data: {
            username: row.username,
            password: row.password,
            status: "Inactive",
            userId: ctx.auth.userId,
          },
        });

        await ctx.prisma.messengerGroup.update({
          where: {
            id: group.id,
          },
          data: {
            messengers: {
              connect: {
                id: createdMessenger.id,
              },
            },
          },
        });

        createdMessengers = [...createdMessengers, createdMessenger];
      }

      return createdMessengers;
    }),
});
