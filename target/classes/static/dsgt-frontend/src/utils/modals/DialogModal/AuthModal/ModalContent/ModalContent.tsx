import React from "react";
import { Formik } from "formik";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import ButtonDiv from "../../../../../lib/fragments/ButtonDiv/ButtonDiv";
import AuthForm from "../../../../forms/AuthForm";
import TextInput from "../../../../../lib/inputs/TextInput/TextInput";

interface State {
    mode: 'login' | 'signup';
}

interface MapStateToProps {}

interface DispatchProps {}

type Props = MapStateToProps & DispatchProps;

class ModalContent extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            mode: 'login'
        };
    }

    toggleMode = () => {
        this.setState(prevState => ({
            mode: prevState.mode === 'login' ? 'signup' : 'login'
        }));
    }

    onSubmit = (values: any) => {
        console.log(values);
    }

    render() {
        const { mode } = this.state;
        const initialValues = {
            email: "",
            password: "",
            username: mode === 'signup' ? "" : undefined,
            confirmPassword: mode === 'signup' ? "" : undefined,
        };

        return (
        <div className="auth-modal">
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
                    <ButtonDiv className="submit-button" onClick={submitForm}>
                        {mode === 'login' ? 'Login' : 'Signup'}
                    </ButtonDiv>
                    </form>
                )}
            </Formik>
            <div className="mode-switch">
                {mode === 'login' 
                    ? "Don't have an account yet? " 
                    : "Already have an account? "
                }
                <div className='mode' onClick={this.toggleMode}>
                    {mode === 'login' ? 'sign up' : 'login'}
                </div>
            </div>
        </div>
        );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ModalContent);