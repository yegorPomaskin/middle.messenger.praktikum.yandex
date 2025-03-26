import Handlebars from "handlebars";
import Block from "../../framework/block.ts";
import styles from "./error.module.css";
import template from "./error.hbs?raw";

interface ErrorPageProps {
    errorName: string;
    errorText: string;
    linkText: string;
    events?: {
        click?: (event: Event) => void;
    };
}

export class ErrorPage extends Block {
    constructor(props: ErrorPageProps) {
        super(props);
    }

    render(): string {
        return Handlebars.compile(template)({
            ...this.props,
            styles,
        });
    }
}
