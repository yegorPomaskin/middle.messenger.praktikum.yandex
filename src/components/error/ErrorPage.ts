// import Handlebars from "handlebars";
import Block from "../../framework/block";
import styles from "./error.module.css";
import template from "./error.hbs?raw";
// import { ErrorLink } from "./ErrorLink";
import { Link } from "../link/link";

interface ErrorPageProps {
    errorName: string;
    errorText: string;
    linkText: string;
    onLinkClick?: (event: Event) => void;
}

export class ErrorPage extends Block {
    constructor(props: ErrorPageProps) {
        super({
            ...props,
            link: new Link({
                text: props.linkText,
                events: {
                    click: props.onLinkClick,
                }
            }),
            styles
        });
    }

    protected render(): string {
        return template
    }
}