import { Policy, type ApiResponse, type CreateObjectResult, type PHID } from "./phorge.js"
import * as z from "zod"

export const Icon = z.object({
    key: z.string(),
    name: z.string(),
    icon: z.string()
})

export type Icon = z.infer<typeof Icon>

export const Color = z.object({
    key: z.string(),
    name: z.string(),
})

export type Color = z.infer<typeof Color>

export const ProjectTransaction = z.object({
    parent: z.custom<PHID<"PROJ">>().optional(),
    milestone: z.custom<PHID<"PROJ">>().optional(),
    space: z.unknown().optional(),
    name: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    slugs: z.string().array().nonempty().optional(),
    members: z.object({
        add: z.custom<PHID<"USER">>().array().nonempty().optional(),
        remove: z.custom<PHID<"USER">>().array().nonempty().optional(),
        set: z.custom<PHID<"USER">>().array().nonempty().optional()
    }).optional(),
    view: z.custom<PHID<"PLCY">>().or(z.enum(["obj.project.members", "users", "admin", "no-one"])).optional(), // TODO, Check Policy ID, and policy constant
    edit: z.custom<PHID<"PLCY">>().or(z.enum(["obj.project.members", "users", "admin", "no-one"])).optional(), // TODO, Check Policy ID, and policy constant
    join: z.custom<PHID<"PLCY">>().or(z.enum(["obj.project.members", "users", "admin", "no-one"])).optional(), // TODO, Check Policy ID, and policy constant
    subtype: z.string().optional(),
    mfa: z.boolean().optional()
})

export type ProjectTransaction = z.infer<typeof ProjectTransaction>

export const ProjectConstraints = z.object({
    ids: z.number().array().nonempty().optional(),
    phids: z.custom<PHID<"PROJ">>().array().nonempty().optional(),
    slugs: z.string().array().nonempty().optional(),
    members: z.custom<PHID<"USER">>().array().nonempty().optional(),
    watchers: z.custom<PHID<"USER">>().array().nonempty().optional(),
    status: z.enum(["active", "archived", "all"]).optional(),
    isMilestone: z.boolean().optional(),
    isRoot: z.boolean().optional(),
    minDepth: z.number().optional(),
    maxDepth: z.number().optional(),
    subtypes: z.string().array().nonempty().optional(),
    icons: z.string().array().nonempty().optional(),
    colors: z.string().array().nonempty().optional(),
    parents: z.custom<PHID<"PROJ">>().array().optional(),
    ancestors: z.custom<PHID<"PROJ">>().array().optional(),
    query: z.string().optional()
})

export type ProjectConstraints = z.infer<typeof ProjectConstraints>

export const ProjectSearchOptions = z.object({
    queryKey: z.string().optional(),
    constraints: z.custom<ProjectConstraints>().optional(),
    attachments: z.object({
        members: z.boolean().optional(),
        watchers: z.boolean().optional(),
        ancestors: z.boolean().optional(),
    }).optional(),
    order: z.enum(["priority", "updated", "outdated", "newest", "oldest", "closed", "title", "relevance"]).optional(),
    before: z.number().optional(),
    after: z.number().optional(),
    limit: z.number().optional()
})

export type ProjectSearchOptions = z.infer<typeof ProjectSearchOptions>

export const SearchProjectResult = z.object({
    id: z.number(),
    type: z.literal("PROJ"),
    phid: z.custom<PHID<"PROJ">>(),
    fields: z.object({
        name: z.string(),
        slug: z.string(),
        subtype: z.string(),
        milestone: z.unknown().nullable(),
        depth: z.number(),
        parent: z.custom<PHID<"PROJ">>().nullable(),
        icon: z.custom<Icon>(),
        color: z.custom<Color>(),
        status: z.enum(["active", "archived", "all"]),
        spacePHID: z.custom<PHID<"SPCE">>().nullable(),
        dateCreated: z.number(),
        dateModified: z.number(),
        policy: Policy,
        description: z.string().nullable(),
    }),
    attachments: z.object({
        members: z.object({
            members: z.object({
                phid: z.custom<PHID<"USER">>()
            }).array()
        }).optional(),
        watchers: z.object({
            watchers: z.object({
                phid: z.custom<PHID<"USER">>()
            }).array()
        }).optional(),
        ancestors: z.object({
            ancestors: z.custom<PHID<"PROJ">>().array()
        }).optional()
    })
})

export type SearchProjectResult = z.infer<typeof SearchProjectResult>

export type CreateProjectResponse = ApiResponse<{ object: CreateObjectResult }>
export type SearchProjectResponse = ApiResponse<{ data: SearchProjectResult[] }>