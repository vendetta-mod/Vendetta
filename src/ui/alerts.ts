import { ConfirmationAlertOptions, InputAlertProps } from "@types";
import { findByProps } from "@metro/filters";
import InputAlert from "@ui/components/InputAlert";

const Alerts = findByProps("openLazy", "close");

interface InternalConfirmationAlertOptions extends Omit<ConfirmationAlertOptions, 'content'> {
    content: string | JSX.Element | JSX.Element[] | undefined;
    body: string | undefined;
    children: JSX.Element | JSX.Element[];
};

export function showConfirmationAlert(options: ConfirmationAlertOptions) {
    const internalOptions = options as InternalConfirmationAlertOptions;

    if (typeof options.content === "string") {
        internalOptions.body = options.content;
    } else {
        internalOptions.children = options.content;
    };

    delete internalOptions.content;

    return Alerts.show(internalOptions);
};

export function showCustomAlert(component: React.ComponentType, props: any) {
    Alerts.openLazy({
        importer: async function () {
            return () => React.createElement(component, props);
        }
    });
};

export function showInputAlert(options: InputAlertProps) {
    showCustomAlert(InputAlert as React.ComponentType, options);
};