// validator.ts
export interface ValidationRule {
  validator: (value: string) => boolean;
  errorMessage: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export class Validator {
  private rules: ValidationRule[];

  constructor(rules: ValidationRule[]) {
    this.rules = rules;
  }

  validate(value: string): ValidationResult {
    for (const rule of this.rules) {
      if (!rule.validator(value)) {
        return {
          isValid: false,
          errorMessage: rule.errorMessage,
        };
      }
    }

    return {
      isValid: true,
      errorMessage: null,
    };
  }
}
