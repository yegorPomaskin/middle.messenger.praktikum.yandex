import Block from "../../framework/block";
import template from "./profile.hbs?raw";
import styles from "./profile.module.css";
import actionLinkStyles from "../../styles/partials/actionLink.module.css";
import sidebarStyles from "../../styles/partials/sidebar.module.css";
import { Link } from "../link/link";
import { ProfileField } from "../profileField/profileField";

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
        // Генерируем HTML для полей профиля
        const fieldsHTML = props.userFields.map(field =>
            new ProfileField({
                name: field.name,
                label: field.label,
                value: field.value,
                type: field.type || 'text',
                mode: field.editable ? 'edit' : 'view',
                events: {
                    change: (e: Event) => this.handleFieldChange(field.name, e),
                    focus: (e: FocusEvent) => this.handleFieldFocus(field.name, e),
                    blur: (e: FocusEvent) => this.handleFieldBlur(field.name, e)
                }
            }).getContent().outerHTML
        ).join('');

        const actionLinksHTML = props.buttons.map(button =>
            `<div class="${styles.profile__actionItem}">
                ${new Link({
                text: button.text,
                href: button.href,
                className: button.className,
                events: button.onClick ? { click: button.onClick } : {}
            }).getContent().outerHTML}
            </div>`
        ).join('');

        super({
            // Основные props
            profileImage: props.profileImage,
            userName: props.userName,

            // Сгенерированный HTML
            fieldsHTML,

            // Стили
            styles,
            actionLinksHTML,
            actionLinkStyles,
            sidebarStyles,

            // Компоненты
            sidebarLink: new Link({
                text: '',
                href: props.sidebarData.href,
                className: sidebarStyles.link,
                events: {
                    click: props.sidebarData.onClick || (() => { })
                }
            }),

            // События
            events: {
                click: (e: Event) => this.handleAvatarClick(e)
            }
        });
    }

    private handleFieldChange(fieldName: string, event: Event) {
        const input = event.target as HTMLInputElement;
        console.log(`Field ${fieldName} changed to: ${input.value}`);
        // Логика обработки изменений
    }

    private handleFieldFocus(fieldName: string, event: FocusEvent) {
        console.log(`Field ${fieldName} focused`);
        // Логика при фокусировке
    }

    private handleFieldBlur(fieldName: string, event: FocusEvent) {
        console.log(`Field ${fieldName} blurred`);
        // Логика при потере фокуса
    }

    private handleAvatarClick(event: Event) {
        const target = event.target as HTMLElement;
        if (target.closest('#changeAvatarBtn')) {
            event.preventDefault();
            console.log('Avatar change requested');
            // Логика смены аватара
        }
    }

    protected render(): string {
        return template;
    }
}