import React from "react";
import { RootState } from "../../store/store";
import { Dispatch } from "redux";
import { connect, useDispatch } from "react-redux";
import HomepageHeader from "./HomepageHeader/HomepageHeader";
import ButtonDiv from "../../lib/fragments/ButtonDiv/ButtonDiv";
import loginImage from "../../assets/images/login.jpg";
import { auth } from "../../utils/helpers/AuthenticationHelper";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import './Homepage.scss';

import { Formik } from "formik";
import TextInput from "../../lib/inputs/TextInput/TextInput";
import AuthForm from "../../utils/forms/AuthForm";
import { useNavigate } from "react-router-dom";
import { NavigateFunction } from "react-router-dom";
import Webshop from "../Webshop/Webshop";
import path from "../../utils/path/path";
import { login } from "../../store/user/slice";

interface State {
  mode: 'login' | 'register';
  error: string | null;
}

interface MapStateToProps {}

interface DispatchProps {
  login: (user: any, token: any, roles: string[]) => void;
}

interface OwnProps {
  navigate: NavigateFunction; 
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class Homepage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: 'login',
      error: null
    }
  }

  toggleMode = () => {
    this.setState({
      mode: this.state.mode === 'login' ? 'register' : 'login'
    });
  }

  onSubmit = (values: any) => {
    const { email, password } = values;
    if (this.state.mode === 'login') {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          this.setState({ error: null });

          user.getIdTokenResult()
          .then((idTokenResult: any) => {
            if (!!idTokenResult.claims.role && idTokenResult.claims.role.includes('manager')) {
              this.props.login(user, idTokenResult.token, ['manager']);
              this.props.navigate(path.webshopPath);
            } else {
              this.props.login(user, idTokenResult.token, []);
              this.props.navigate(path.webshopPath);
            }
          })
          .catch((error: any) => {
            console.error(error);
          });
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({ error: "Email and Password don't match." });
          console.error(errorCode, errorMessage);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          var user = userCredential.user;
          this.setState({ error: null });

          user.getIdTokenResult()
          .then((idTokenResult: any) => {
            if (!!idTokenResult.claims.role && idTokenResult.claims.role.includes('manager')) {
              this.props.login(user, idTokenResult.token, ['manager']);
              this.props.navigate(path.webshopPath);
            } else {
              this.props.login(user, idTokenResult.token, []);
              this.props.navigate(path.webshopPath);
            }
          })
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
        
          if (errorCode === 'auth/email-already-in-use') {
            errorMessage = 'This email is already in use.';
          }
        
          this.setState({ error: errorMessage });
          console.error(errorCode, errorMessage);
        });
    }
  }

  render() {
    const { mode, error } = this.state;

    return (
      <div>
        <div className="homepage-content">
          <div className="login-form">
            <div className="login-header">
             <HomepageHeader />
            </div>
            <div className="login-content">
              <h1 className="login-form-title">{mode === 'login' ? 'Login' : 'Create Account'}</h1>
              <Formik
                  initialValues={{ email: "", password: "" }}
                  onSubmit={this.onSubmit}
                  validationSchema={AuthForm.validationSchema()}
              >
                  {({ 
                      values,
                      handleChange, 
                      handleSubmit, 
                      submitForm,
                      errors, 
                      touched 
                  }) => (
                      <form onSubmit={handleSubmit}>
                      <TextInput
                          title="Email"
                          inputName="email"
                          inputValue={values.email}
                          inputOnChange={handleChange}
                          touched={touched}
                          errors={errors}
                          inputType="email"
                      />
                      <TextInput
                          title="Password"
                          inputName="password"
                          inputValue={values.password}
                          inputOnChange={handleChange}
                          touched={touched}
                          errors={errors}
                          inputType="password"
                      />
                      {error && <p className="error-message">{error}</p>} 
                      <ButtonDiv className="submit-button" onClick={submitForm}>
                        {mode === 'login' ? 'Login' : 'Signup'}
                      </ButtonDiv>
                      </form>
                  )}
              </Formik>
              <div className="login-footer">
                <p>{mode === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}</p>
                <ButtonDiv className="login-button" onClick={this.toggleMode}>
                    {mode === 'login' ? 'Signup' : 'Login'}
                </ButtonDiv>
              </div>
            </div>
          </div>
          <div className="background"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({});
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
  login: (user: any, token: any, roles: string[]) => dispatch(login({ user, token, roles}))
});

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);
  