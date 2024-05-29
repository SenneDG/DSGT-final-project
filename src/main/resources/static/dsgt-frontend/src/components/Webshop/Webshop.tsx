import React from "react";
import ShopItem from "./ShopItem/ShopItem";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from "../../utils/helpers/AuthenticationHelper";
import Banner from "../../lib/fragments/Banner/Banner";

import "./Webshop.scss";
import WebshopHeader from "./WebshopHeader/WebshopHeader";
import ApiService from "../../utils/api/ApiService";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../store/store";
import { NavigateFunction } from "react-router-dom";
import ModalHelper from "../../utils/helpers/ModalHelper";

interface State {
  items: any[];
  banner: { visible: boolean; message: string; }; 
}

interface MapStateToProps {
  user: any;
}

interface DispatchProps {}

interface OwnProps {
  navigate: NavigateFunction;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class Webshop extends React.PureComponent<Props, State> {
  timeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
      banner: { visible: false, message: '' }, 
    };
  }

  componentDidMount() {
    ApiService.general.getAllShopItems(this.props.user.token || '')
      .then((response) => {
        console.log(response);
        this.setState({ items: response.data });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          ModalHelper.openErrorModal({ message: 'You are unauthorized. Please login again.'});
        } else {
          ModalHelper.openErrorModal({ message: 'Failed to fetch shop items' });
        }
      });
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId); 
    }
  }

  handleAddToCart = (itemName: string) => { 
    this.setState({ banner: { visible: true, message: `${itemName} added to shopping cart` } });
    this.timeoutId = setTimeout(() => this.setState({ banner: { visible: false, message: '' } }), 5000); 
  }

  render() {
    return (
      <div className="webshop">
        <WebshopHeader navigate={this.props.navigate} />
        <Banner 
          message={this.state.banner.message} 
          color="#63b5a1" 
          isVisible={this.state.banner.visible}
        />
        <div className="shop-items">
        {this.state.items.length > 0 ? (
          this.state.items.map(item => (
            <ShopItem key={item.id} id={item.id} supplier={item.supplier} image={item.imageUrl} title={item.name} price={item.price} description={item.description} maxQuantity={item.quantity} onAddToCart={this.handleAddToCart} /> 
          ))
        ) : (
          <h1>No shop items available.</h1>
        )}
      </div>
    </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user,
});
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Webshop);