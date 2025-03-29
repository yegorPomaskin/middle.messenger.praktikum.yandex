import Block from "../../framework/block";
import template from "./profileField.hbs?raw";
import styles from "./commonProfileStyles.module.css";

interface ProfileFieldProps {
    name: string;
    label: string;
    value: string;
    type?: string;
    mode?: 'view' | 'edit';
    editable?: boolean; // Added the editable property

    events?: {
        focus?: (event: FocusEvent) => void;
        blur?: (event: FocusEvent) => void;
        change?: (event: Event) => void;
    };
}

export class ProfileField extends Block {
    private _oldValue: string = '';

    constructor(props: ProfileFieldProps) {
        // Determine mode (default to 'view')
        const mode = props.mode || 'view';

        super({    
            ...props,
            styles,
            isViewMode: mode === 'view', // For convenience in the template
            isPassword: props.type === 'password',
            editable: props.editable !== undefined ? props.editable : true // Default to true if not specified
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