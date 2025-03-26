import { ErrorPage } from "../components/error/ErrorPage";
import { renderLinksPage } from "./links";
// import Block from "../framework/block";

export function render404ErrorPage() {
    const app = document.getElementById("app");
    if (!app) return;

    const errorPage = new ErrorPage({
        errorName: "404",
        errorText: "Не туда попали",
        linkText: "Назад к чатам",
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

    app.innerHTML = "";
    app.appendChild(errorPage.getContent()!);

    errorPage.dispatchComponentDidMount();
}
