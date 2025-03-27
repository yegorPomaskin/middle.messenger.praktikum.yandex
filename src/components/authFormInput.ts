// components/AuthInput/AuthInput.ts
import Block from "../framework/block";

export interface AuthInputProps {
    label: string;
    name: string;
    type: string;
    required: boolean;
    styles?: { [key: string]: string };
}

export class AuthInput extends Block {
    constructor(props: AuthInputProps) {
        super(props);
    }

    render(): string {
        const { label, name, type, required, styles } = this.props;
        return `
        <label for="${name}" class="${styles.form__label}">${label}</label>
        <input
            class="${styles.form__input}"
            type="${type}"
            id="${name}"
            name="${name}"
            ${required ? "required" : ""}
        />
    `;
    }
}
