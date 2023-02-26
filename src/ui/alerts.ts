import { ConfirmationAlertOptions } from "@types";
import { findByProps } from "@metro/filters";

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