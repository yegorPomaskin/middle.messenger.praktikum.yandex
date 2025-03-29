import Block from "../framework/block"
import { ErrorPage } from "../components/error/ErrorPage";
import { renderLinksPage } from "../pages/links";

export class Error505Page extends Block {
    constructor() {
        super({
            errorPage: new ErrorPage({
                errorName: "505",
                errorText: "Уже фиксим",
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
