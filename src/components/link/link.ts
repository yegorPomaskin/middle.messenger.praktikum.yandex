import Block from "../../framework/block";
import styles from "./link.module.css";

interface LinkProps {
    text: string;
    className?: string;
    events?: {
        click?: (event: Event) => void;
    };
    href?: string;
}

export class Link extends Block {
    constructor(props: LinkProps) {
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
                class="${styles.link} ${this.props.className || ''}"
                data-action="back">
                ${this.props.text}
            </a>
        `;
    }
}