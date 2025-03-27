import Block from "../../framework/block";
import styles from "./error.module.css";

interface ErrorLinkProps {
    text: string;
    onClick?: (e: Event) => void;
}

export class ErrorLink extends Block {
    constructor(props: ErrorLinkProps) {
        super({
            ...props,
            events: {
                click: (e: Event) => {
                    e.preventDefault(); // Предотвращаем переход по #
                    props.onClick?.(e); // Вызываем переданный колбэк
                }
            }
        });
    }

    protected render(): string {
        return `
            <a href="#" class="${styles.error__link}" data-action="back">
                ${this.props.text}
            </a>
        `;
    }
}