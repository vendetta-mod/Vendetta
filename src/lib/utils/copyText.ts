import { clipboard } from "@metro/common";

export default function copyText(content: string) {
    try {
        clipboard.setString(content);
    } catch (e) {
        throw new Error("Failed to set clipboard content.");
    }
}