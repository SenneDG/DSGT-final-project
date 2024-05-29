import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../store/store";
import "./CheckoutPage.scss";
import { NavigateFunction } from "react-router-dom";
import HomepageHeader from "../Homepage/HomepageHeader/HomepageHeader";
import { CartItem, clearCart, removeItem, updateItemQuantity } from "../../store/cart/slice";
import WebshopHeader from "../Webshop/WebshopHeader/WebshopHeader";
import QuantifyInput from "../../lib/inputs/QuantifyInput/QuantifyInput";
import ButtonDiv from "../../lib/fragments/ButtonDiv/ButtonDiv";
import { Formik } from "formik";
import TextInput from "../../lib/inputs/TextInput/TextInput";
import ApiService from "../../utils/api/ApiService";
import path from "../../utils/path/path";
import ModalHelper from "../../utils/helpers/ModalHelper";

interface State {}

interface MapStateToProps {
    cartItems: CartItem[]; 
    user: any;
}

interface DispatchProps {
    removeItem: (id: string) => void;
    updateItemQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
}

interface OwnProps {
    navigate: NavigateFunction;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class CheckoutPage extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    setQuantity = (id: string, quantity: number): void => {
        this.props.updateItemQuantity( id, quantity ); 
    }   

    render() {
        const { cartItems } = this.props; 

        return (
            <div className="checkout-page">
                <WebshopHeader navigate={this.props.navigate} />
                <div className="checkout-content">
                    <div className="checkout-my-cart">
                        <h2>My Cart</h2>
                        <div className="checkout-items">
                        {cartItems.length > 0 ? (
                            cartItems.map(item => (
                            <div className='checkout-item' key={item.id}>
                                <div className='checkout-item-details'>
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <div className="checkout-item-actions">
                                    <QuantifyInput quantity={item.quantity} maxQuantity={item.maxQuantity} setQuantity={(quantity) => this.setQuantity(item.id, quantity)} />
                                    <ButtonDiv className="remove-button" onClick={() => this.props.removeItem(item.id)}>Remove</ButtonDiv>
                                </div>
                                <p>Total: {(item.quantity * item.price).toFixed(2)}€</p>
                                <hr className="divider"/>
                                </div>
                            </div>
                            ))
                        ) : (
                            <p className="empty-cart">Your Cart Is Empty</p>
                        )}
                        </div>
                        <div className="checkout-info">
                            <h4>Total</h4>
                            <p>{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}€</p>
                        </div>
                    </div>
                    <div className="checkout-form">
                        <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            address: '',
                            cardNumber: '',
                            expiryDate: '',
                            cvv: '',
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            console.log(values);
                            ApiService.general.checkout(this.props.user.token, cartItems.map(item => ({ id: item.id, supplier: item.supplier, quantity: item.quantity, name: item.name })))
                            .then(() => {
                                this.props.clearCart();
                                this.props.navigate(path.webshopPath);
                            })
                            .catch((error) => {
                                console.error(error);
                                console.log(error);
                                let message = "The checkout can not be processed.\n";
                                let outOfStockItems = error.response.data.outOfStockItems;
                                console.log(outOfStockItems);
                                if (outOfStockItems.length != 0) {
                                    for (const [key, value] of Object.entries(outOfStockItems)) {
                                        message += `There are only ${value} left of item ${key}\n`;
                                    }
                                }
                                ModalHelper.openErrorModal({message: message});
                            })
                            .finally(() => {
                                setSubmitting(false);
                            });
                        }}
                        >
                        {({ isSubmitting, handleChange, handleSubmit, values, touched, errors }) => (
                            <form>
                            <TextInput
                                title="Name"
                                inputName="name"
                                inputValue={values.name}
                                inputOnChange={handleChange}
                                touched={touched}
                                errors={errors}
                            />

                            <TextInput
                                title="Email"
                                inputName="email"
                                inputValue={values.email}
                                inputOnChange={handleChange}
                                touched={touched}
                                errors={errors}
                            />

                            <TextInput
                                title="Address"
                                inputName="address"
                                inputValue={values.address}
                                inputOnChange={handleChange}
                                touched={touched}
                                errors={errors}
                            />

                            <TextInput
                                title="Card Number"
                                inputName="cardNumber"
                                inputValue={values.cardNumber}
                                inputOnChange={handleChange}
                                touched={touched}
                                errors={errors}
                            />

                            <TextInput
                                title="Expiry Date"
                                inputName="expiryDate"
                                inputValue={values.expiryDate}
                                inputOnChange={handleChange}
                                touched={touched}
                                errors={errors}
                            />

                            <TextInput
                                title="CVV"
                                inputName="cvv"
                                inputValue={values.cvv}
                                inputOnChange={handleChange}
                                touched={touched}
                                errors={errors}
                            />

                            <ButtonDiv className="checkout-button" disabled={isSubmitting || cartItems.length === 0} onClick={handleSubmit}>
                                Checkout
                            </ButtonDiv>
                            </form>
                        )}
                        </Formik>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState): MapStateToProps => ({
    cartItems: state.cart.items, 
    user: state.user,   
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
    removeItem: (id: string) => {
        dispatch(removeItem(id));
    },
    updateItemQuantity: (id: string, quantity: number) => {
        dispatch(updateItemQuantity({ id, quantity }));
    },
    clearCart: () => {
        dispatch(clearCart());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutPage);