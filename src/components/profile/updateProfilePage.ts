import Block from "../../framework/block";
import template from "../profile/profile.hbs?raw"; // Reusing the existing template
import styles from "../profile/profile.module.css";
import commonStyles from "../profileField/commonProfileStyles.module.css";
import { Sidebar } from "../sidebar/sidebar";
import { ProfileField } from "../profileField/profileField";
import { Button } from "../button/button";
import buttonStyles from "../button/button.module.css";

interface UpdateProfilePageProps {
    profileImage: string;
    userName: string;
    userFields: Array<{
        name: string;
        label: string;
        value: string;
        type?: string;
        editable?: boolean;
    }>;
    sidebarData: {
        href: string;
        iconSrc: string;
        onClick?: (event: Event) => void;
    };
    onSave?: (formData: Record<string, string>) => void;
    onCancel?: () => void;
}

export class UpdateProfilePage extends Block {
    constructor(props: UpdateProfilePageProps) {
        // Create sidebar component
        const sidebar = new Sidebar({
            href: props.sidebarData.href,
            iconSrc: props.sidebarData.iconSrc,
            onClick: props.sidebarData.onClick,
        });

        // Create components for profile fields
        const fields = (props.userFields || []).map(field => 
            new ProfileField({
                name: field.name,
                label: field.label,
                value: field.value,
                type: field.type || 'text',
                mode: 'edit',
                editable: field.editable !== undefined ? field.editable : true,
                events: {
                    focus: (e: FocusEvent) => {
                        console.log(`Field ${field.name} focused`, e);
                    },
                    blur: (e: FocusEvent) => {
                        console.log(`Field ${field.name} blurred`, e);
                    },
                    change: (e: Event) => {
                        const input = e.target as HTMLInputElement;
                        console.log(`Field ${field.name} changed to: ${input.value}`);
                    }
                }
            })
        );

        // Create save button with the correct class name
        const saveButton = new Button({
            text: "Сохранить",
            type: "submit",
            className: buttonStyles["button--save"], // Using the correct class name from your CSS
            events: {
                click: (e: Event) => {
                    e.preventDefault();
                    console.log('Save button clicked');
                    
                    if (props.onSave) {
                        const formData: Record<string, string> = {};
                        
                        // Collect form data from fields
                        if (this.lists && this.lists.fields) {
                            this.lists.fields.forEach(field => {
                                if (field.element) {
                                    const input = field.element.querySelector('input');
                                    if (input) {
                                        formData[input.name] = input.value;
                                    }
                                }
                            });
                        }
                        
                        props.onSave(formData);
                    }
                }
            }
        });

        // Create cancel button with a custom style
        const cancelButton = new Button({
            text: "Отмена",
            type: "button",
            className: buttonStyles["button--cancel"], // Custom class for cancel button
            events: {
                click: (e: Event) => {
                    e.preventDefault();
                    console.log('Cancel button clicked');
                    
                    if (props.onCancel) {
                        props.onCancel();
                    }
                }
            }
        });

        // Create buttons array for the template
        const buttons = [saveButton, cancelButton];

        super({
            ...props,
            sidebar,
            fields,
            buttons,
            styles,
            commonStyles,
            isEditMode: true, // Set to true for the update profile page
            events: {
                submit: (e: Event) => {
                    e.preventDefault();
                    console.log('Form submitted');
                }
            }
        });
    }

    protected render(): string {
        return template;
    }
}