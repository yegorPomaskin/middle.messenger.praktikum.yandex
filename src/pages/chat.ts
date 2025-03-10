import chatTemplate from '../templates/chat.hbs?raw';
import Handlebars from 'handlebars';
import { renderAuthPage } from './auth';

export function renderChatPage() {
    const app = document.getElementById('app');
    if (!app) return;

    const template = Handlebars.compile(chatTemplate);

    app.innerHTML = template({});

    const linkToAuth = document.getElementById('link-to-auth');
    linkToAuth?.addEventListener('click', (event) => {
        event.preventDefault();
        renderAuthPage();
    });
}
