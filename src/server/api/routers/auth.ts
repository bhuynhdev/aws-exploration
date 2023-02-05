import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if username exists yet
      const isUsernameExisted =
        (await ctx.prisma.user.count({ where: { username: input.username } })) > 0;
      if (isUsernameExisted) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: JSON.stringify([
            {
              message: "Username already existed. Please choose a new username",
            },
          ]),
        });
      }
      return ctx.prisma.user.create({ data: input });
    }),

  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findFirst({
      where: { id: ctx.session.user.id },
      select: { username: true, firstName: true, lastName: true, email: true },
    });
  }),
});
