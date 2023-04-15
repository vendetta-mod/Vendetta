import { toasts } from "@metro/common";

export const showToast = (content: string, asset?: number) => toasts.open({
    content: content,
    source: asset,
});