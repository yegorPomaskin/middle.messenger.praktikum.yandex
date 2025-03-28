import Block from "../../framework/block";
import styles from "./error.module.css";

interface ErrorLinkProps {
    text: string;
    events?: {
        click?: (event: Event) => void;
    };
}

export class ErrorLink extends Block {
    constructor(props: ErrorLinkProps) {
        super({
            ...props,
            events: {
                click: (e: Event) => {
                    e.preventDefault();
                    props.events?.click?.(e);
                }
            }
        });
    }

    protected render(): string {
        return `
            <a href="#" 
               class="${styles.error__link}" 
               data-action="back">
               ${this.props.text}
            </a>
        `;
    }
}