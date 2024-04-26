import IdentityNumberHelper from './IdentityNumberHelper';

const notUnicodeMatch = (name: string) => [
  /^[a-zA-Z0-9]+/,
  {
    message: `${name}`,
    excludeEmptyString: true,
  },
];

const handleEnterKeyUp = (event: any, callback: () => void) => {
  const focusOnElement = (form: any, inputs: any[], index: number) => {
    if (inputs.length > index) {
      inputs[index].focus();
    }
  };

  if (event.key === 'Enter') {
    const form = <any>document.getElementsByTagName('form')[0];
    if (form !== undefined) {
      const inputs = [...form].filter(
        (item) => !item.readOnly && item.type !== 'file',
      );
      const index = inputs.indexOf(event.target);
      if (index !== -1) {
        event.preventDefault();
        if (callback) callback();
        focusOnElement(form, inputs, index + 1);
      }
    }
  }
};

const identityNumberValidation = (id: string) =>
  /^[A-Z](1|2)\d{8}$/.test(id) && IdentityNumberHelper.idNumberCheck(id);

const emailValidation = (email: string) => {
  if (email !== undefined) {
    return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
  }
  return true;
};

const englishValidation = (name: string) => {
  if (name !== undefined) {
    return /^[a-zA-Z][a-zA-Z '-.‘’]+$/i.test(name);
  }
  return true;
};

const passportNumberValidation = (value: string) => {
  if (value !== undefined) {
    return /^[A-Z0-9]+$/.test(value);
  }
  return true;
};

const englishNumberValidation = (value: string) => {
  if (value !== undefined) {
    return /^[a-zA-Z0-9]+$/i.test(value);
  }
  return true;
};

const addressValidation = (address: string) => {
  if (address !== undefined) {
    const splitAddressList = address.split('|');
    return splitAddressList[0] !== '';
  }
  return true;
};

const verificationStringValidation = (value: string) => {
  if (value !== undefined) {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value);
  }
  return true;
};

export default {
  notUnicodeMatch,
  handleEnterKeyUp,
  identityNumberValidation,
  emailValidation,
  englishValidation,
  passportNumberValidation,
  englishNumberValidation,
  addressValidation,
  verificationStringValidation,
};
