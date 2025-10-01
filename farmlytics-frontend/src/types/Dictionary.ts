// types/Dictionary.ts
export type Dictionary = {
  login: {
    title: string;
    email: {
      label: string;
      placeholder: string;
      invalid: string;
    };
    password: {
      label: string;
      placeholder: string;
      invalid: string;
    };
    submit: string;
    noAccount: string;
    registerLink: string;
  };
  register: {
    title: string;
    firstName: {
      label: string;
      placeholder: string;
      invalid: string;
    };
    lastName: {
      label: string;
      placeholder: string;
      invalid: string;
    };
    district: {
      label: string;
      placeholder: string;
      invalid: string;
      select: string;
      options: {
        gasabo: string;
        kicukiro: string;
        nyarugenge: string;
        // ... more districts
      };
    };
    email: {
      label: string;
      placeholder: string;
      invalid: string;
    };
    password: {
      label: string;
      placeholder: string;
      invalid: string;
      min: string;
    };
    confirmPassword: {
      label: string;
      placeholder: string;
      invalid: string;
      match: string;
    };
    submit: string;
    haveAccount: string;
    loginLink: string;
  };
  // ... other translations
};