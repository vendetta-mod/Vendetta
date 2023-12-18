import { InputAlertProps } from "@types";
import { findByProps } from "@metro/filters";
import { Forms, Alert } from "@ui/components";

const { FormInput } = Forms;
const Alerts = findByProps("openLazy", "close");

export default function InputAlert({ title, confirmText, confirmColor, onConfirm, cancelText, placeholder, initialValue = "" }: InputAlertProps) {
    const [value, setValue] = React.useState(initialValue);
    const [error, setError] = React.useState("");

    function onConfirmWrapper() {
        const asyncOnConfirm = Promise.resolve(onConfirm(value))

        asyncOnConfirm.then(() => {
            Alerts.close();
        }).catch((e: Error) => {
            setError(e.message);
        });
    };

    return (
        <Alert
            title={title}
            confirmText={confirmText}
            confirmColor={confirmColor}
            isConfirmButtonDisabled={error.length !== 0}
            onConfirm={onConfirmWrapper}
            cancelText={cancelText}
            onCancel={() => Alerts.close()}
        >
            <FormInput
                placeholder={placeholder}
                value={value}
                onChangeText={(v: string) => {
                    setValue(v);
                    if (error) setError("");
                }}
                returnKeyType="done"
                onSubmitEditing={onConfirmWrapper}
                error={error}
                autoFocus={true}
                showBorder={true}
                style={{ paddingVertical: 5, alignSelf: "stretch", paddingHorizontal: 0 }}
            />
        </Alert>
    );
};