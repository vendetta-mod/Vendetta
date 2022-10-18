import { React } from "@metro/common";
import { findByProps } from "@metro/filters";

interface VersionProps {
    label: string;
    version: string
}

const { FormRow, FormText } = findByProps("FormSection");

export default function Version({ label, version }: VersionProps) {
    return ( 
        <FormRow
            label={label}
            trailing={() => <FormText>{version}</FormText>}
        />
    )
}