import { AuthForm, AuthField } from '../components/authForm/authForm';
import Block, { BlockProps } from '../framework/block';

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

interface AuthPageProps extends BlockProps {
  [key: string]: unknown;
  AuthForm?: AuthForm;
}

export class AuthPage extends Block<AuthPageProps> {
  constructor() {
    super({
      AuthForm: new AuthForm({
        ...AUTH_FORM_CONFIG,
        onLinkClick: () => {
          const registerPage = new RegisterPage();
          const app = document.getElementById('app');
          if (app) {
            app.innerHTML = '';
            const content = registerPage.getContent();
            if (content) {
              app.appendChild(content);
              registerPage.dispatchComponentDidMount();
            }
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
