import { TaskSearchOptions, SearchTaskResult, ManiphestStatus, SearchManiphestStatusResult, ManiphestPriority } from "./models/maniphest.js";
import { PhorgeError, CreateObjectResult, type PHID } from "./models/phorge.js";
import { SearchProjectResult, ProjectSearchOptions, ProjectEditTransaction } from "./models/project.js";
import { SearchTransactionResult, TransactionSearchOptions } from "./models/transaction.js";
import { SearchUserResult, UserSearchOptions } from "./models/user.js";
import { AttachmentsObjectToParams, ConstraintObjectToParams, EditTransactionObjectToParams } from "./utils.js";

// Import types only
import type { SearchTaskResponse, TaskTransaction, CreateTaskResponse, SearchManiphestStatusResponse, SearchManiphestPriorityResponse } from "./models/maniphest.js";
import type { SearchProjectResponse, CreateProjectResponse } from "./models/project.js"
import type { SearchTransactionResponse } from "./models/transaction.js";
import type { SearchUserResponse } from "./models/user.js";

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

    async searchProject(options?: ProjectSearchOptions): Promise<SearchProjectResult[]> {
        let params = new URLSearchParams()
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey)
            }

            if (options.constraints !== undefined) {
                for (const [key, value] of ConstraintObjectToParams(options.constraints)) {
                    params.append(key, value)
                }
            }

            if (options.attachments !== undefined && options.attachments !== null) {
                for (const [key, value] of AttachmentsObjectToParams(options.attachments)) {
                    params.append(key, value)
                }
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

    async editProject(phid: PHID<"PROJ">, transactions: ProjectEditTransaction[]): Promise<CreateObjectResult> {
        let params = EditTransactionObjectToParams(transactions);
        params.append("objectIdentifier", phid);
        params.append("api.token", this.token);

        const resp = await this.call<CreateProjectResponse>("project.edit", params);
        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async createProject(transactions: ProjectEditTransaction[]): Promise<CreateObjectResult> {
        let params = EditTransactionObjectToParams(transactions)
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
            return ManiphestPriority.array().parse(resp.result.data);
        }
    }

    async searchTask(options?: TaskSearchOptions): Promise<SearchTaskResult[]> {
        let params = new URLSearchParams()
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey)
            }

            if (options.constraints !== undefined) {
                for (const [key, value] of ConstraintObjectToParams(options.constraints)) {
                    params.append(key, value)
                }
            }

            if (options.attachments !== undefined) {
                for (const [key, value] of AttachmentsObjectToParams(options.attachments)) {
                    params.append(key, value)
                }
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

        const resp = await this.call<SearchTaskResponse>("maniphest.search", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.data;
        }
    }

    async createTask(transactions: TaskTransaction[]): Promise<CreateObjectResult> {
        let params = EditTransactionObjectToParams(transactions)
        params.append("api.token", this.token);

        const resp = await this.call<CreateTaskResponse>("maniphest.edit", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async updateTask(phid: PHID<"TASK">, transactions: TaskTransaction[]): Promise<CreateObjectResult> {
        let params = EditTransactionObjectToParams(transactions)
        params.append("objectIdentifier", phid);
        params.append("api.token", this.token);

        const resp = await this.call<CreateTaskResponse>("maniphest.edit", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return resp.result.object;
        }
    }

    async searchUser(options?: UserSearchOptions): Promise<SearchUserResult> {
        let params = new URLSearchParams()
        params.append("api.token", this.token);
        if (options !== undefined) {
            if (options.queryKey) {
                params.append("queryKey", options.queryKey);
            }
            if (options.constraints !== undefined) {
                for (const [key, value] of ConstraintObjectToParams(options.constraints)) {
                    params.append(key, value)
                }
            }
            if (options.attachments) {
                for (const [key, value] of AttachmentsObjectToParams(options.attachments)) {
                    params.append(key, value)
                }
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
            return SearchUserResult.parse(resp.result.data);
        }
    }

    async searchTransaction(options?: TransactionSearchOptions): Promise<SearchTransactionResult> {
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
                for (const [key, value] of ConstraintObjectToParams(options.constraints)) {
                    params.append(key, value)
                }
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
            return SearchTransactionResult.parse(resp.result.data);
        }
    }

    async searchManiphestStatus(): Promise<SearchManiphestStatusResult> {
        let params = new URLSearchParams();
        params.append("api.token", this.token);

        const resp = await this.call<SearchManiphestStatusResponse>("maniphest.status.search", params);

        if (resp.error_code !== null) {
            throw new PhorgeError(resp.error_code, resp.error_info);
        } else {
            return SearchManiphestStatusResult.parse(resp.result.data);
        }
    }
}