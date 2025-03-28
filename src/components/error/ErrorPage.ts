import Handlebars from "handlebars";
import Block from "../../framework/block";
import styles from "./error.module.css";
import template from "./error.hbs?raw";
import { ErrorLink } from "./ErrorLink";

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
            link: new ErrorLink({
                text: props.linkText,
                events: {
                    click: props.onLinkClick,
                }
            }),
            styles
            
            // linkHtml: link.getContent().outerHTML
        });
    }

    protected render(): string {
        return template
    }
}