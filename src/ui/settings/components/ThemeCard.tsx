import { getCurrentThemeData, selectTheme } from "@/lib/themes";
import { Theme } from "@types";
import Card from "./Card";

interface ThemeCardProps {
    theme: Theme;
    index: number;
}

export default function ThemeCard({ theme, index }: ThemeCardProps) {
    const currentTheme = getCurrentThemeData();
    const [enabled, setEnabled] = React.useState(currentTheme?.name === theme.data.name);

    return (
        <Card 
            index={index}
            headerLabel={theme.data.name}
            descriptionLabel={theme.data.description}
            toggleType="radio"
            toggleValue={enabled}
            onToggleChange={(v: boolean) => {
                setEnabled(v);
                selectTheme(v ? theme.id : "default");
                setImmediate(() => window.nativeModuleProxy.BundleUpdaterManager.reload())
            }}
        />
    )
}
