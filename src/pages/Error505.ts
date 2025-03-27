import Block from "../framework/block"
import { ErrorPage } from "../components/error/ErrorPage";
import { renderLinksPage } from "../pages/links";

interface Error505PageProps {
    errorName: string;
    errorText: string;
    linkText: string;
}

export class Error505Page extends Block {
    constructor() {
        super({
            errorName: "505",
            errorText: "Уже фиксим",
            linkText: "Назад к чатам",
        });
    }

    override render(): string {
        const app = document.getElementById("app");
        if (!app) return "";

        // Создаем компонент ErrorPage и передаем необходимые данные
        const errorPage = new ErrorPage({
            errorName: this.props.errorName,
            errorText: this.props.errorText,
            linkText: this.props.linkText,
            events: {
                click: (event: Event) => {
                    const target = event.target as HTMLElement;
                    if (target && target.id === "error-link") {
                        event.preventDefault();
                        renderLinksPage();
                    }
                },
            },
        });

        return errorPage.getContent()!.outerHTML;
    }
}
