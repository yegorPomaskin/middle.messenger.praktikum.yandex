import Block from "../../framework/block";
import styles from "./button.module.css";

interface ButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    className?: string;
    attr?: Record<string, string>;
    events?: {
        click?: (event: Event) => void;
    };
}

export class Button extends Block {
    constructor(props: ButtonProps) {
        // Always include the base button class and append any additional class names
        const buttonClass = `${styles.button} ${props.className || ''}`;
        
        super({
            ...props,
            type: props.type || "button",
            attr: {
                ...props.attr,
                type: props.type || "button",
                class: buttonClass,
            }
        });
    }

    protected render(): string {
        return `
            <button
                {{#each attr}}
                    {{@key}}="{{this}}"
                {{/each}}
            >
                {{text}}
            </button>
        `;
    }
}