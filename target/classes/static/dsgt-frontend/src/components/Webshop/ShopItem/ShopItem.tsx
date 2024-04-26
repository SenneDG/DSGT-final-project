import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../../store/store";

import "./ShopItem.scss";
import ButtonDiv from "../../../lib/fragments/ButtonDiv/ButtonDiv";
import { addItem } from "../../../store/cart/slice";
import QuantifyInput from "../../../lib/inputs/QuantifyInput/QuantifyInput";

interface State {
    quantity: number;
}

interface MapStateToProps {
    cartQuantity: number;
}

interface DispatchProps {
    addItem: (item: any) => void;
}

interface OwnProps {
    id: string;
    supplier: string;
    title: string;
    image: string;
    description: string;
    maxQuantity: number;
    price: number;
    onAddToCart: (itemName: string) => void;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class ShopItem extends React.PureComponent<Props, State> {
    constructor(props: Props) {
    super(props);
    this.state = {
        quantity: 1
    };
    }

    handleBuyClick = () => {
        this.props.addItem({id: this.props.id, supplier: this.props.supplier, name: this.props.title, description: this.props.description, price: this.props.price , quantity: this.state.quantity, maxQuantity: this.props.maxQuantity, image: this.props.image});
        this.props.onAddToCart(this.props.title);
        this.setQuantity(1);
    }

    setQuantity = (quantity: number) => {
        this.setState({ quantity });
    };

    render() {
        const totalPrice = this.state.quantity * this.props.price;

        return (
            <div className="item">
                <div className="item-image">
                    <img src={this.props.image} alt={this.props.title}/>
                </div>
                <div className="item-info">
                    <h3 className="item-info-top">{this.props.title}</h3>
                    <div className="item-info-bottom">
                        <p>Price: {this.props.price}€</p>
                        <ButtonDiv 
                            className={`buy-button ${this.props.maxQuantity === 0 ? 'sold-out' : ''}`} 
                            onClick={this.handleBuyClick} 
                            disabled={this.props.maxQuantity === 0 || (this.props.maxQuantity !== undefined && this.props.cartQuantity >= this.props.maxQuantity)}
                            >
                            {this.props.maxQuantity === 0 ? 'Sold Out' : 'Put In Cart'}
                        </ButtonDiv>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
    cartQuantity: state.cart?.items?.find(item => item.id === ownProps.id)?.quantity || 0
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    addItem: (item: any) => dispatch(addItem(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopItem);