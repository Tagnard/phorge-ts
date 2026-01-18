import * as z from "zod"
import { Policy, type ApiResponse, type CreateObjectResult, type PHID } from "./phorge.js"

export const UserConstraints = z.object({
    ids: z.number().array().nonempty().optional(),
    phids: z.custom<PHID<"USER">>().array().nonempty().optional(),
    usernames: z.string().array().nonempty().optional(),
    nameLike: z.string().nonempty().optional(),
    isAdmin: z.boolean().optional(),
    isDisabled: z.boolean().optional(),
    isBot: z.boolean().optional(),
    isMailingList: z.boolean().optional(),
    needsApproval: z.boolean().optional(),
    mfa: z.boolean().optional(),
    createdStart: z.number().optional(),
    createdEnd: z.number().optional(),
    query: z.string().nonempty().optional()
})

export type UserConstraints = z.infer<typeof UserConstraints>

export const UserSearchOptions = z.object({
    queryKey: z.string().optional(),
    constraints: z.custom<UserConstraints>().optional(),
    attachments: z.object({
        availability: z.boolean().optional(),
    }).optional(),
    order: z.enum(["priority", "updated", "outdated", "newest", "oldest", "closed", "title", "relevance"]).optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
})

export type UserSearchOptions = z.infer<typeof UserSearchOptions>

export const User = z.object({
    id: z.number(),
    type: z.literal("USER"),
    phid: z.custom<PHID<"USER">>(),
    fields: z.object({
        username: z.string(),
        realName: z.string(),
        roles: z.string().array(),
        dateCreated: z.number(),
        dateModified: z.number(),
        policy: Policy
    }),
    attachments: z.unknown()
})

export type User = z.infer<typeof User>

export type CreateUserResponse = ApiResponse<{ object: CreateObjectResult }>
export type SearchUserResponse = ApiResponse<{ data: User[] }>
