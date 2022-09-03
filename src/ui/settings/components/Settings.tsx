import { React, ReactNative as RN } from "@metro/common";
import { findByProps } from "@metro/filters";

const { FormRow, FormSection } = findByProps("FormSection");

export default function Settings() {
    return ( 
        <>
            <FormSection title="Versions">
                <FormRow 
                    label="React"
                    trailing={() => <RN.Text>{React.version}</RN.Text>}
                />
            </FormSection>
        </>
    )
}