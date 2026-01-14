export function ConstraintObjectToParams(obj: Record<string, any>, prefix = ""): URLSearchParams {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
        console.log(k, v)
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
    return params;
}

export function EditTransactionObjectToParams(transactions: Record<string, any>[]): URLSearchParams {
    const params = new URLSearchParams();
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
    return params;
}


export function AttachmentsObjectToParams(obj: Record<string, any>): URLSearchParams {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
        const value = typeof v === "string" ? v : JSON.stringify(v);
        params.append(`attachments[${k}]`, value);
    }
    return params;
}