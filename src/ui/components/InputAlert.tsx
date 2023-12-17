import { InputAlertProps } from "@types";
import { findByName, findByProps } from "@metro/filters";

interface InternalInputAlertProps extends InputAlertProps {
    onClose?: () => void;
    onSubmit?: (input: string) => void;
    isLoading?: boolean;
}

const Alerts = findByProps("openLazy", "close");
const UserSettingsInputAlert = findByName("UserSettingsInputAlert") as React.ComponentClass<InternalInputAlertProps>;

// TODO: Moving to Discord's UserSettingsInputAlert here has some issues:
//* - Errors are not cleared upon typing
//* - The confirmText does not apply
//* - The confirm button is not disabled when there is an error

export default class InputAlert extends UserSettingsInputAlert {
    constructor(props: InternalInputAlertProps) {
        super(props);
        props.secureTextEntry = false;
        props.onClose = Alerts.close;
        props.onSubmit = (i: string) => this.onConfirmWrapper(i);
        this.state = { input: props.initialValue };
    }

    onConfirmWrapper(input: string) {
        // @ts-expect-error
        this.props.isLoading = true;

        const asyncOnConfirm = Promise.resolve(this.props.onConfirm(input));

        asyncOnConfirm.then(() => {
            Alerts.close();
        }).catch((e: Error) => {
            this.setState({ error: e.message });
        });

        // @ts-expect-error
        this.props.isLoading = false;
    };
}
