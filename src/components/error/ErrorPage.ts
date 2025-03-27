import Handlebars from "handlebars";
import Block from "../../framework/block.ts";
import styles from "./error.module.css";
import template from "./error.hbs?raw";
import { ErrorLink } from "./ErrorLink.ts";

export interface ErrorPageProps {
    errorName: string;
    errorText: string;
    linkText: string;
    onLinkClick?: (event: Event) => void;
}

export class ErrorPage extends Block {
    
    constructor(props: ErrorPageProps) {
        super({
            props, 
            ErrorLink: new ErrorLink({
                text: props.linkText,
                onClick: props.onLinkClick,
            })
         });
    }

    render(): string {

        console.log(template)
        return Handlebars.compile(template)({
            ...this.props.props,
            styles,
        });
    }
}
