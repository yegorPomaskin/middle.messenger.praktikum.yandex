import { AuthForm, AuthField } from '../components/authForm/authForm';
import Block from '../framework/block';

import { RegisterPage } from './register';

const fields: AuthField[] = [
  { label: 'Логин', name: 'login', type: 'text', required: true },
  { label: 'Пароль', name: 'password', type: 'password', required: true },
];

const AUTH_FORM_CONFIG = {
  title: 'Вход',
  fields,
  buttonText: 'Авторизоваться',
  linkText: 'Нет аккаунта?',
};

export class AuthPage extends Block {
  constructor() {
    super({
      AuthForm: new AuthForm({
        ...AUTH_FORM_CONFIG,
        onLinkClick: () => {
          const registerPage = new RegisterPage();
          const app = document.getElementById('app');
          if (app) {
            app.innerHTML = '';
            app.appendChild(registerPage.getContent()!);
            registerPage.dispatchComponentDidMount();
          }
        },
        onSubmit: (e: Event) => {
          e.preventDefault();
          // Логика отправки формы авторизации
          console.log('Форма авторизации отправлена');
        },
      }),
    });
  }

  protected render(): string {
    return '{{{ AuthForm }}}';
  }
}
