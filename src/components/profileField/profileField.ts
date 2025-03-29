import Block from "../../framework/block";
import template from "./profileField.hbs?raw";
import styles from "./commonProfileStyles.module.css";

interface ProfileFieldProps {
    name: string;
    label: string;
    value: string;
    type?: string;
    mode?: 'view' | 'edit';
    events?: {
        focus?: (event: FocusEvent) => void;
        blur?: (event: FocusEvent) => void;
        change?: (event: Event) => void;
    };
}

export class ProfileField extends Block {
    private _oldValue: string = '';

    constructor(props: ProfileFieldProps) {
        super({
            ...props,
            styles,
            type: props.type || 'text',
            mode: props.mode || 'view'
        });
    }

    protected render(): string {
        return template;
    }

    handleFocus(event: FocusEvent) {
        const input = event.target as HTMLInputElement;
        this._oldValue = input.value;
        this.props.events?.focus?.(event);
    }

    handleBlur(event: FocusEvent) {
        const input = event.target as HTMLInputElement;
        if (!input.value.trim()) {
            input.value = this._oldValue;
        }
        this.props.events?.blur?.(event);
    }

    handleChange(event: Event) {
        this.props.events?.change?.(event);
    }
}