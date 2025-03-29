import Block from "../../../framework/block";
import styles from "./authInput.module.css";

export interface AuthInputProps {
    label: string;
    name: string;
    type: string;
    required?: boolean;
    value?: string;
    placeholder?: string;
    events?: {
        change?: (e: Event) => void;
        focus?: (e: Event) => void;
        blur?: (e: Event) => void;
    };
}

export class AuthInput extends Block {
    constructor(props: AuthInputProps) {
        super({
            ...props,
            events: {
                change: (e: Event) => this.handleChange(e),
                blur: (e: Event) => this.handleBlur(e),
                ...props.events // Сохраняем переданные события
            }
        });
    }

    private handleChange(e: Event) {
        const input = e.target as HTMLInputElement;
        this.setProps({ value: input.value });
    }

    private handleBlur(e: Event) {
        const input = e.target as HTMLInputElement;
        if (this.props.required && !input.value.trim()) {
            console.warn(`Поле ${this.props.label} обязательно`);
        }
    }

    public getValue(): string {
        return this.props.value || '';
    }

    protected render(): string {
        const { label, name, type, required, placeholder, value } = this.props;

        return `
            <div class="${styles.input__wrapper || ''}">
                <label for="${name}" class="${styles.form__label || ''}">
                    ${label}
                </label>
                <input
                    class="${styles.form__input || ''}"
                    type="${type}"
                    id="${name}"
                    name="${name}"
                    value="${value || ''}"
                    placeholder="${placeholder || ''}"
                    ${required ? 'required' : ''}
                />
            </div>
        `;
    }
}