import { clipboard } from "@metro/common";

// TODO: Remove/deprecate this, the clipboard module works the same way.

export default function copyText(content: string) {
    try {
        clipboard.setString(content);
    } catch (e) {
        throw new Error("Failed to set clipboard content.");
    }
}