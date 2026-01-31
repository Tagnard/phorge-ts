export function ConstraintObjectToParams(obj: Record<string, any>, params: URLSearchParams, prefix = ""): void {
    for (const [k, v] of Object.entries(obj)) {
        if (Array.isArray(v)) {
            let index = 0;
            v.forEach((item: string, j: number) => {
                const itemVal = typeof item === "string" ? item : JSON.stringify(item);
                params.append(`constraints[${k}][${index}]`, itemVal);
                index++;
            });
        } else {
            const value = typeof v === "string" ? v : JSON.stringify(v);
            params.append(`constraints[${k}]`, value);
        }
    }
}

export function UpdateTransactionObjectToParams(transactions: Record<string, any>[], params: URLSearchParams): void {
    transactions.forEach((transaction, index) => {
        const typeKey = `transactions[${index}][type]`;
        const valueKey = `transactions[${index}][value]`;
        params.append(typeKey, transaction.type);
        if (Array.isArray(transaction.value)) {
            transaction.value.forEach((item: string, j: number) => {
                const itemKey = `${valueKey}[${j}]`;
                params.append(itemKey, item);
            });
        } else {
            params.append(valueKey, transaction.value);
        }
    });
}


export function AttachmentsObjectToParams(obj: Record<string, any>, params: URLSearchParams): void {
    for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
            const v = obj[k];
            const value = typeof v === "string" ? v : JSON.stringify(v);
            params.append(`attachments[${k}]`, value);
        }
    }
}
