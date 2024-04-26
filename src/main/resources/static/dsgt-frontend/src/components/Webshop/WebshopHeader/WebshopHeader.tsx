import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdLogOut } from 'react-icons/io';


import "./WebshopHeader.scss";
import Webshop from "../Webshop";
import { connect } from "react-redux";
import { addItem, clearCart } from "../../../store/cart/slice";
import { Dispatch } from "redux";
import { RootState } from "../../../store/store";
import ButtonDiv from "../../../lib/fragments/ButtonDiv/ButtonDiv";
import { logout } from "../../../store/user/slice";
import { NavigateFunction } from "react-router-dom";
import path from "../../../utils/path/path";

interface State {}

interface MapStateToProps {
    totalQuantity: number;
    roles: string[];
}

interface DispatchProps {
    logout: () => void;
    clearCart: () => void;
}

interface OwnProps {
    navigate: NavigateFunction;
}

type Props = MapStateToProps & DispatchProps & OwnProps;
class WebshopHeader extends React.PureComponent<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {};
        this.handleCheckout = this.handleCheckout.bind(this);
    }

    handleCheckout() {    
        this.props.navigate(path.checkoutPath);
    }

    handleLogout = () => {
        this.props.logout();
        this.props.clearCart();
        this.props.navigate(path.mainPath);
    }

    render() {
    const { totalQuantity } = this.props;

    return (
        <div className="webshop-header">
            <h1 className="title" onClick={() => this.props.navigate(path.webshopPath)}>DSGT Broker</h1>
            <div className="webshop-actions">
                {this.props.roles.includes('manager') ? (
                    <ButtonDiv 
                        className="manager-button"
                        onClick={() => this.props.navigate(path.managerPath)}
                    >
                        Manager
                    </ButtonDiv>
                ) : null}
                <div className="checkout-icon" onClick={this.handleCheckout}>
                <FiShoppingCart size={30} color="white"/>
                {totalQuantity > 0 && (
                    <div className="cart-quantity-popup">
                    {totalQuantity}
                    </div>
                )}
                </div>
                <ButtonDiv className="logout-button" onClick={this.handleLogout}>
                    <IoMdLogOut size={30} color="white"/>
                </ButtonDiv>
            </div>
        </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    totalQuantity: state.cart.items.reduce((total, item) => total + item.quantity, 0),
    roles: state.user.roles
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: () => dispatch(logout()),
    clearCart: () => dispatch(clearCart())
});

export default connect(mapStateToProps, mapDispatchToProps)(WebshopHeader);