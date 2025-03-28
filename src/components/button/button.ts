import Block from "../../framework/block";
import styles from "./button.module.css";

interface ButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    className?: string;
    events?: {
        click?: (event: Event) => void;
    };
}

export class Button extends Block {
    constructor(props: ButtonProps) {
        super({
            ...props,
            type: props.type || "button",
        });
    }

    protected render(): string {
        return `
            <button
                type="{{type}}"
                class="${styles.button} {{className}}"
            >
                {{text}}
            </button>
        `;
    }
}