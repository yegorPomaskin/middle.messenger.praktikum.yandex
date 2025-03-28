import Block from "../framework/block"
import { ErrorPage } from "../components/error/ErrorPage";
import { renderLinksPage } from "../pages/links";

export class Error404Page extends Block {
    constructor() {
        super({
            errorPage: new ErrorPage({
                errorName: "404",
                errorText: "Не туда попали",
                linkText: "Назад к чатам",
                onLinkClick: (e: Event) => {
                    e.preventDefault();
                    renderLinksPage();
                }
            })
        });
    }

    protected render(): string {
        return `
            {{{ errorPage }}}
        `;
    }
}
