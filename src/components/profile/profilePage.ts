import Block from "../../framework/block";
import template from "./profile.hbs?raw";
import styles from "./profile.module.css";
import commonStyles from "../profileField/commonProfileStyles.module.css";
import { Sidebar } from "../sidebar/sidebar";
import { Link } from "../link/link";

interface ProfilePageProps {
    profileImage: string;
    userName: string;
    userFields: Array<{
        name: string;
        label: string;
        value: string;
        type?: string;
        editable?: boolean;
    }>;
    buttons: Array<{
        text: string;
        className: string;
        href: string;
        useDefaultClass?: boolean;
        onClick?: (event: Event) => void;
    }>;
    sidebarData: {
        href: string;
        iconSrc: string;
        onClick?: (event: Event) => void;
    };
}

export class ProfilePage extends Block {
    constructor(props: ProfilePageProps) {
        // Создаем сайдбар
        const sidebar = new Sidebar({
            href: props.sidebarData.href,
            iconSrc: props.sidebarData.iconSrc,
            onClick: props.sidebarData.onClick,
        });

        // Добавляем классы из CSS модулей к строковым свойствам
        const profileFieldsClass = commonStyles.profile__fields;
        const profileActionsClass = styles.settings__actions; // Используем класс из styles
        
        // Формируем HTML для полей
        const fieldsHTML = generateFieldsHTML(props.userFields || [], commonStyles);
        
        // Формируем HTML для кнопок с использованием компонента Link
        const buttonsHTML = generateButtonsHTML(props.buttons || [], commonStyles);

        super({
            ...props,
            sidebar,
            profileFieldsClass,
            profileActionsClass: styles.settings__actions,
            fieldsHTML,
            buttonsHTML,
            styles,
            commonStyles,
            isEditMode: false,
            events: {
                click: (e: Event) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('#changeAvatarBtn')) {
                        e.preventDefault();
                        console.log('Avatar change requested');
                    }
                    // Обработка событий клика теперь перенесена в компоненты Link
                }
            }
        });
    }

    protected render(): string {
        return template;
    }
}

// Вспомогательные функции для генерации HTML с CSS-модулями
function generateFieldsHTML(fields: ProfilePageProps['userFields'], styles: any): string {
    const fieldsContent = fields.map(field => `
        <div class="${styles.profile__fieldItem}">
            <div class="${styles.profile__fieldLabel || styles.profile__label}">${field.label}:</div>
            <div class="${styles.profile__fieldValue || styles.profile__value}">${field.value}</div>
        </div>
    `).join('');
    
    return fieldsContent;
}

function generateButtonsHTML(buttons: ProfilePageProps['buttons'], styles: any): string {
    const actions = ['editData', 'changePassword', 'logout'];
    
    return buttons.map((button, index) => {
        const dataAction = actions[index] || '';
        
        // Создаем экземпляр компонента Link с правильными параметрами
        const link = new Link({
            href: button.href,
            text: button.text,
            className: button.className,
            useDefaultClass: false, // Отключаем дефолтный класс
            // Не используем attributes, так как они не обрабатываются в текущем шаблоне
            // Нам нужно использовать либо реф.элемент, либо модифицировать после рендеринга
            events: {
                click: (e: Event) => {
                    e.preventDefault();
                    console.log(`${dataAction} clicked`);
                    
                    if (button.onClick) {
                        button.onClick(e);
                    }
                }
            }
        });
        
        // Получаем DOM-элемент и устанавливаем data-action вручную
        const content = link.getContent();
        if (content instanceof HTMLElement) {
            const linkElement = content.querySelector('a');
            if (linkElement) {
                linkElement.setAttribute('data-action', dataAction);
            }
        }
        
        // Оборачиваем компонент Link в div с классом profile__actionItem
        return `
            <div class="${styles.profile__actionItem}">
                ${link.getContent().outerHTML}
            </div>
        `;
    }).join('');
}