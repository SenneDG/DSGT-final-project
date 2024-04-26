import BaseForm from './BaseForm';

import FormikHelper from '../helpers/FormikHelper';

class AuthForm extends BaseForm {
  initialValue = () => ({
    email: '',
    password: '',
  });

  validationSchema = () =>
    this.Yup.object().shape({
      email: this.Yup.string()
        .required('Email required！')
        .test('Invalid email', 'Email invalid！', (mail: string) =>
          FormikHelper.emailValidation(mail),
        ),
      password: this.Yup.string().required('Password required!'),
    });
}

const authForm = new AuthForm();

export default authForm;
