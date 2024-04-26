import React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../store/store";
import { NavigateFunction } from "react-router-dom";
import WebshopHeader from "../Webshop/WebshopHeader/WebshopHeader";
import { db } from "../../utils/helpers/AuthenticationHelper";
import { collection, getDocs } from "firebase/firestore";

import "./ManagerPage.scss";

interface State {
  orders: any[];
}

interface MapStateToProps {}

interface DispatchProps {}

interface OwnProps {
    navigate: NavigateFunction;
}

type Props = MapStateToProps & DispatchProps & OwnProps;

class ManagerPage extends React.PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      orders: [], 
    };
  }

  componentDidMount() {
    // Get all orders from Firestore
    getDocs(collection(db, 'orders')) // Use collection and getDocs
      .then((snapshot) => {
        const orders = snapshot.docs.map(doc => doc.data());
        console.log("Orders: ", orders);
        this.setState({ orders });
      })
      .catch((error) => {
        console.error("Error getting orders: ", error);
      });
  }

  componentWillUnmount() {}


  render() {
    const { orders } = this.state;
  
    return (
      <div >
        <WebshopHeader navigate={this.props.navigate} />
        <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Quantity</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <>
                <tr>
                  <td colSpan={3}>Order {index + 1}</td>
                </tr>
                {order.items && order.items.map((item: { quantity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, itemIndex: any) => (
                  <tr key={`order-${index}-item-${itemIndex}`}>
                    <td></td>
                    <td>{item.quantity}</td>
                    <td>{item.name}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
});
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);