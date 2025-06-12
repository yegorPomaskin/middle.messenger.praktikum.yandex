import { ErrorPage } from '../components/error/ErrorPage';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

interface Error404PageProps extends BlockProps {
  [key: string]: unknown;
  errorPage?: ErrorPage;
}

export class Error404Page extends Block<Error404PageProps> {
  constructor() {
    super({
      errorPage: new ErrorPage({
        errorName: '404',
        errorText: 'Не туда попали',
        linkText: 'Назад к чатам',
        onLinkClick: (e: Event) => {
          e.preventDefault();
          router.go('/messenger');
        },
      }),
    });
  }

  protected render(): string {
    return `
            {{{ errorPage }}}
        `;
  }
}
