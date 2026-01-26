import { ManiphestSearchOptions, ManiphestTask, ManiphestStatus, ManiphestPriority } from "./models/maniphest.js";
import { PhorgeError, CreateObjectResult, type PHID } from "./models/phorge.js";
import { Project, ProjectSearchOptions, ProjectUpdateTransaction } from "./models/project.js";
import { Transaction, TransactionSearchOptions } from "./models/transaction.js";
import { User, UserSearchOptions } from "./models/user.js";
import { PhrictionDocument, PhrictionSearchOptions, PhrictionContentParams, PhrictionUpdateTransaction, PhrictionInfo } from "./models/phriction.js";
import { AttachmentsObjectToParams, ConstraintObjectToParams, UpdateTransactionObjectToParams } from "./utils.js";

// Import types only
import type { SearchManiphestResponse, ManiphestUpdateTransaction, CreateManiphestResponse, SearchManiphestStatusResponse, SearchManiphestPriorityResponse } from "./models/maniphest.js";
import type { SearchProjectResponse, CreateProjectResponse } from "./models/project.js"
import type { SearchTransactionResponse } from "./models/transaction.js";
import type { SearchUserResponse } from "./models/user.js";
import type { SearchPhrictionResponse, CreatePhrictionResponse, EditPhrictionResponse, UpdatePhrictionResponse } from "./models/phriction.js";

export class Client {
    constructor(private uri: string, private token: string) { }

    private async call<T>(api: string, params: URLSearchParams): Promise<T> {
        let resp = await fetch(`${this.uri}/api/${api}`, {
            method: "POST",
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return await resp.json();
    }

    async searchProject(options?: ProjectSearchOptions): Promise<Project[]> {
        let params = new URLSearchParams()
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey)
            }

            if (options.constraints !== undefined) {
                ConstraintObjectToParams(options.constraints, params)
            }

            if (options.attachments !== undefined && options.attachments !== null) {
                AttachmentsObjectToParams(options.attachments, params)
            }

            if (options.order !== undefined) {
                params.append("order", options.order)
            }

            if (options.before !== undefined) {
                params.append("before", options.before.toString())
            }

            if (options.after !== undefined) {
                params.append("after", options.after.toString())
            }

            if (options.limit !== undefined) {
                params.append("limit", options.limit.toString())
            }
        }

        params.append("api.token", this.token);

        const resp = await this.call<SearchProjectResponse>("project.search", params);
        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async updateProject(phid: PHID<"PROJ">, transactions: ProjectUpdateTransaction[]): Promise<CreateObjectResult> {
        let params = new URLSearchParams()
        UpdateTransactionObjectToParams(transactions, params);
        params.append("objectIdentifier", phid);
        params.append("api.token", this.token);

        const resp = await this.call<CreateProjectResponse>("project.edit", params);
        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async createProject(transactions: ProjectUpdateTransaction[]): Promise<CreateObjectResult> {
        let params = new URLSearchParams()
        UpdateTransactionObjectToParams(transactions, params)
        params.append("api.token", this.token);

        const resp = await this.call<CreateProjectResponse>("project.edit", params);
        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async searchManiphestPriority(): Promise<ManiphestPriority[]> {
        let params = new URLSearchParams();
        params.append("api.token", this.token);

        const resp = await this.call<SearchManiphestPriorityResponse>("maniphest.priority.search", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async searchManiphest(options?: ManiphestSearchOptions): Promise<ManiphestTask[]> {
        let params = new URLSearchParams()
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey)
            }

            if (options.constraints !== undefined) {
                ConstraintObjectToParams(options.constraints, params)
            }

            if (options.attachments !== undefined) {
                AttachmentsObjectToParams(options.attachments, params)
            }

            if (options.order !== undefined) {
                params.append("order", options.order)
            }

            if (options.before !== undefined) {
                params.append("before", options.before.toString())
            }

            if (options.after !== undefined) {
                params.append("after", options.after.toString())
            }

            if (options.limit !== undefined) {
                params.append("limit", options.limit.toString())
            }
        }

        params.append("api.token", this.token);

        const resp = await this.call<SearchManiphestResponse>("maniphest.search", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async createManiphest(transactions: ManiphestUpdateTransaction[]): Promise<CreateObjectResult> {
        let params = new URLSearchParams()
        UpdateTransactionObjectToParams(transactions, params)
        params.append("api.token", this.token);

        const resp = await this.call<CreateManiphestResponse>("maniphest.edit", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async updateManiphest(phid: PHID<"TASK">, transactions: ManiphestUpdateTransaction[]): Promise<CreateObjectResult> {
        let params = new URLSearchParams()
        UpdateTransactionObjectToParams(transactions, params)
        params.append("objectIdentifier", phid);
        params.append("api.token", this.token);

        const resp = await this.call<CreateManiphestResponse>("maniphest.edit", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async searchUser(options?: UserSearchOptions): Promise<User[]> {
        let params = new URLSearchParams()
        params.append("api.token", this.token);
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey);
            }
            if (options.constraints !== undefined) {
                ConstraintObjectToParams(options.constraints, params)
            }
            if (options.attachments) {
                AttachmentsObjectToParams(options.attachments, params)
            }
            if (options.order) {
                // TODO: Implement order type
            }
            if (options.before) {
                params.append("before", options.before.toString());
            }
            if (options.after) {
                params.append("after", options.after.toString());
            }
            if (options.limit) {
                params.append("limit", options.limit.toString());
            }
        }

        params.append("api.token", this.token);

        let resp = await this.call<SearchUserResponse>("user.search", params);
        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async searchTransaction(options?: TransactionSearchOptions): Promise<Transaction[]> {
        let params = new URLSearchParams()
        params.append("api.token", this.token);
        if (options !== undefined) {
            if (options.objectIdentifier) {
                params.append("objectIdentifier", options.objectIdentifier);
            }
            if (options.objectType) {
                params.append("objectType", options.objectType);
            }
            if (options.constraints !== undefined) {
                ConstraintObjectToParams(options.constraints, params)
            }
            if (options.before) {
                params.append("before", options.before.toString());
            }
            if (options.after) {
                params.append("after", options.after.toString());
            }
            if (options.limit) {
                params.append("limit", options.limit.toString());
            }
        }

        let resp = await this.call<SearchTransactionResponse>("transaction.search", params);
        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async searchManiphestStatus(): Promise<ManiphestStatus[]> {
        let params = new URLSearchParams();
        params.append("api.token", this.token);

        const resp = await this.call<SearchManiphestStatusResponse>("maniphest.status.search", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async searchPhriction(options?: PhrictionSearchOptions): Promise<PhrictionDocument[]> {
        let params = new URLSearchParams();
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey)
            }

            if (options.constraints !== undefined) {
                ConstraintObjectToParams(options.constraints, params)
            }

            if (options.attachments !== undefined) {
                AttachmentsObjectToParams(options.attachments, params)
            }

            if (options.order !== undefined) {
                if (Array.isArray(options.order)) {
                    options.order.forEach((o, i) => params.append(`order[${i}]`, o));
                } else {
                    params.append("order", options.order)
                }
            }

            if (options.before !== undefined) {
                params.append("before", options.before.toString())
            }

            if (options.after !== undefined) {
                params.append("after", options.after.toString())
            }

            if (options.limit !== undefined) {
                params.append("limit", options.limit.toString())
            }
        }

        params.append("api.token", this.token);

        const resp = await this.call<SearchPhrictionResponse>("phriction.document.search", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async createPhriction(params: PhrictionContentParams): Promise<PhrictionInfo> {
        let urlParams = new URLSearchParams();
        urlParams.append("slug", params.slug);
        if (params.title) urlParams.append("title", params.title);
        if (params.content) urlParams.append("content", params.content);
        if (params.description) urlParams.append("description", params.description);
        urlParams.append("api.token", this.token);

        const resp = await this.call<CreatePhrictionResponse>("phriction.create", urlParams);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result;
        }
    }

    async editPhriction(params: PhrictionContentParams): Promise<PhrictionInfo> {
        let urlParams = new URLSearchParams();
        urlParams.append("slug", params.slug);
        if (params.title) urlParams.append("title", params.title);
        if (params.content) urlParams.append("content", params.content);
        if (params.description) urlParams.append("description", params.description);
        urlParams.append("api.token", this.token);

        const resp = await this.call<EditPhrictionResponse>("phriction.edit", urlParams);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result;
        }
    }

    async updatePhriction(phid: PHID<"WIKI">, transactions: PhrictionUpdateTransaction[]): Promise<CreateObjectResult> {
        let params = new URLSearchParams();
        UpdateTransactionObjectToParams(transactions, params);
        params.append("objectIdentifier", phid);
        params.append("api.token", this.token);

        const resp = await this.call<UpdatePhrictionResponse>("phriction.document.edit", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }
}