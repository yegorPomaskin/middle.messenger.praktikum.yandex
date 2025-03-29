import Block from "../../framework/block";
import template from "./profileField.hbs?raw";
import styles from "./commonProfileStyles.module.css";

interface ProfileFieldProps {
    name: string;
    label: string;
    value: string;
    type?: string;
    mode?: 'view' | 'edit';
    isViewMode?: boolean;  
    isPassword?: boolean;
    events?: {
        focus?: (event: FocusEvent) => void;
        blur?: (event: FocusEvent) => void;
        change?: (event: Event) => void;
    };
}

export class ProfileField extends Block {
    private _oldValue: string = '';

    constructor(props: ProfileFieldProps) {
        // Определяем режим (по умолчанию 'view')
        const mode = props.mode || 'view';

        super({    
            ...props,
            styles,
            isViewMode: mode === 'view', // Для удобства в шаблоне
            isPassword: props.type === 'password'
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