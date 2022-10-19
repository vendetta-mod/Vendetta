import { React } from "@metro/common";
import { Forms } from "@ui/components";

interface VersionProps {
    label: string;
    version: string
}

const { FormRow, FormText } = Forms;

export default function Version({ label, version }: VersionProps) {
    return ( 
        <FormRow
            label={label}
            trailing={() => <FormText>{version}</FormText>}
        />
    )
}