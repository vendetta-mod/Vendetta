import { NavigationNative } from "@metro/common";
import { without } from "@lib/utils";
import { ErrorBoundary } from "@ui/components";

export default function CustomPage({ render: PageView, noErrorBoundary, ...options }: { render: React.ComponentType, noErrorBoundary: boolean } & Record<string, any>) {
    const navigation = NavigationNative.useNavigation();

    navigation.addListener("focus", () => navigation.setOptions(without(options, "render", "noErrorBoundary")));
    return noErrorBoundary ? <PageView /> : <ErrorBoundary><PageView /></ErrorBoundary>;
}