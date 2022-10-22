import { toasts } from "@metro/common";

export function showToast(content: string, asset: number) {
    return toasts.open({
        content: content,
        source: asset
    });
}