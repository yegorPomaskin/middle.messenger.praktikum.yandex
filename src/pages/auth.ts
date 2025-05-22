import { AuthForm, AuthField } from '../components/authForm/authForm';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

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
        onLinkClick: (e: Event) => {
          e.preventDefault();
          router.go('/sign-up');
        },
        onSubmit: (e: Event) => {
          e.preventDefault();
          // Логика отправки формы авторизации
          console.log('Форма авторизации отправлена');
          router.go('/messenger');
        },
      }),
    });
  }

  protected render(): string {
    return '{{{ AuthForm }}}';
  }
}
