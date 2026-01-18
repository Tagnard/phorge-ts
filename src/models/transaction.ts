import * as z from "zod";
import { ObjectType, type ApiResponse, type PHID } from "./phorge.js";

export const TransactionConstraints = z.object({
    phids: z.custom<PHID>().array().optional(),
    authorPHIDs: z.custom<PHID<"USER">>().array().optional()
})

export type TransactionConstraints = z.infer<typeof TransactionConstraints>

export const TransactionSearchOptions = z.object({
    objectIdentifier: z.custom<PHID>().optional(),
    objectType: ObjectType.optional(),
    constraints: z.custom<TransactionConstraints>().optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
})

export type TransactionSearchOptions = z.infer<typeof TransactionSearchOptions>

export const TransactionComment = z.object({
    id: z.number(),
    phid: z.string(),
    version: z.number(),
    authorPHID: z.custom<PHID<"USER">>(),
    dateCreated: z.number(),
    dateModified: z.number(),
    removed: z.boolean(),
    content: z.object({ raw: z.string() })
})

export type TransactionComment = z.infer<typeof TransactionComment>

export const Transaction = z.object({
    id: z.number(),
    phid: z.string(),
    type: z.string().nullable(),
    authorPHID: z.custom<PHID<"USER">>(),
    objectPHID: z.custom<PHID>(),
    dateCreated: z.number(),
    dateModified: z.number(),
    groupID: z.string(),
    comments: TransactionComment.array()
});

export type Transaction = z.infer<typeof Transaction>

export type SearchTransactionResponse = ApiResponse<{ data: Transaction[] }>
