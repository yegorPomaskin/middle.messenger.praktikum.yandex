import { ValidationRule } from './validator';

export const VALIDATION_RULES = {
  // Для first_name, second_name — латиница или кириллица, первая буква заглавная, без пробелов, цифр и спецсимволов (допустим только дефис)
  name: (
    errorMessage = 'Первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис)',
  ): ValidationRule => ({
    validator: (value: string) => /^[A-ZА-ЯЁ][a-zа-яёA-ZА-ЯЁ-]*$/.test(value),
    errorMessage,
  }),

  // login — от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)
  login: (
    errorMessage = 'От 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание)',
  ): ValidationRule => ({
    validator: (value: string) => {
      // От 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, допустимы дефис и нижнее подчёркивание
      const loginRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
      return loginRegex.test(value) && !/^\d+$/.test(value);
    },
    errorMessage,
  }),

  // email — латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы
  email: (
    errorMessage = 'Латиница, может включать цифры и спецсимволы, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы',
  ): ValidationRule => ({
    validator: (value: string) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/;
      return emailRegex.test(value);
    },
    errorMessage,
  }),

  // password — от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра
  password: (
    errorMessage = 'От 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра',
  ): ValidationRule => ({
    validator: (value: string) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasDigit = /\d/.test(value);
      const validLength = value.length >= 8 && value.length <= 40;
      return hasUpperCase && hasDigit && validLength;
    },
    errorMessage,
  }),

  // phone — от 10 до 15 символов, состоит из цифр, может начинается с плюса
  phone: (
    errorMessage = 'От 10 до 15 символов, состоит из цифр, может начинаться с плюса',
  ): ValidationRule => ({
    validator: (value: string) => {
      const phoneRegex = /^\+?\d{10,15}$/;
      return phoneRegex.test(value);
    },
    errorMessage,
  }),

  // message — не должно быть пустым
  message: (errorMessage = 'Сообщение не может быть пустым'): ValidationRule => ({
    validator: (value: string) => value.trim() !== '',
    errorMessage,
  }),
};

// Предустановленные наборы правил для разных типов полей
export const NAME_VALIDATION = [VALIDATION_RULES.name()];

export const LOGIN_VALIDATION = [VALIDATION_RULES.login()];

export const EMAIL_VALIDATION = [VALIDATION_RULES.email()];

export const PASSWORD_VALIDATION = [VALIDATION_RULES.password()];

export const PHONE_VALIDATION = [VALIDATION_RULES.phone()];

export const MESSAGE_VALIDATION = [VALIDATION_RULES.message()];
