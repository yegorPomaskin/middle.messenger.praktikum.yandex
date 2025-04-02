import { AuthRegisterForm } from '../components/registerForm/registerForm';
import Block from '../framework/block';

import { AuthPage } from './auth';

const REGISTER_FORM_CONFIG = {
  title: 'Регистрация',
  fields: [
    { label: 'Почта', name: 'email', type: 'email', required: true },
    { label: 'Логин', name: 'login', type: 'text', required: true },
    { label: 'Имя', name: 'first_name', type: 'text', required: true },
    { label: 'Фамилия', name: 'last_name', type: 'text', required: true },
    { label: 'Телефон', name: 'phone', type: 'tel', required: true },
    { label: 'Пароль', name: 'password', type: 'password', required: true },
    {
      label: 'Пароль еще раз',
      name: 'password_repeat',
      type: 'password',
      required: true,
    },
  ],
  buttonText: 'Зарегистрироваться',
  linkText: 'Войти',
  linkHref: '#login',
};

export class RegisterPage extends Block {
  constructor() {
    super({
      RegisterForm: new AuthRegisterForm({
        ...REGISTER_FORM_CONFIG,
        isLogin: false,
        onLinkClick: () => {
          const authPage = new AuthPage();
          const app = document.getElementById('app');
          if (app) {
            app.innerHTML = '';
            const content = authPage.getContent();
            if (content) {
              app.appendChild(content);
              authPage.dispatchComponentDidMount();
            }
          }
        },
        onSubmit: (e: Event) => {
          e.preventDefault();
          // Логика отправки формы авторизации
        },
      }),
    });
  }

  override render(): string {
    return `{{{ RegisterForm }}}`;
  }
}
