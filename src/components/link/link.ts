import Block from "../../framework/block";
import styles from "./link.module.css";

interface LinkProps {
    text: string;
    className?: string;
    events?: {
        click?: (event: Event) => void;
    };
    href?: string;
    useDefaultClass?: boolean;
}

export class Link extends Block {
    constructor(props: LinkProps) {
        const baseClass = props.useDefaultClass === false ? '' : styles.link;

        super({
            ...props,
            className: `${baseClass} ${props.className || ''}`.trim(),
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
            <a href="${this.props.href || '#'}"
                class="${this.props.className}"
                data-action="back">
                ${this.props.text}
            </a>
        `;
    }
}