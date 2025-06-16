import { AuthForm, AuthField } from '../components/authForm/authForm';
import AuthController from '../controllers/AuthController';
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
        onSubmit: async (formData: Record<string, string>) => {
          try {
            await AuthController.signIn({
              login: formData.login,
              password: formData.password,
            });
          } catch (error) {
            console.error('Ошибка авторизации:', error);
          }
        },
      }),
    });
  }

  protected render(): string {
    return '{{{ AuthForm }}}';
  }
}
