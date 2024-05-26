import React from "react";

import { connect } from "react-redux";
import { Dispatch } from "redux";
import { RootState } from "../../store/store";
import { NavigateFunction } from "react-router-dom";
import WebshopHeader from "../Webshop/WebshopHeader/WebshopHeader";
import { db } from "../../utils/helpers/AuthenticationHelper";
import { collection, getDocs } from "firebase/firestore";

import "./ManagerPage.scss";
import ApiService from "../../utils/api/ApiService";

interface State {
  orders: any[];
}

interface MapStateToProps {
  user: any;
}

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
    ApiService.manager.getOrders(this.props.user.token || '')
      .then((response) => {
        console.log(response);
        this.setState({ orders: response.data });
      })
      .catch((error) => {
        console.error("Error getting orders: ", error);
      });
  }

  componentWillUnmount() {}

  render() {
    const { orders } = this.state;
  
    return (
      <div>
        <WebshopHeader navigate={this.props.navigate} />
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Quantity</th>
                <th>Name</th>
                <th>State</th> 
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <>
                  <tr>
                    <td colSpan={4}>Order {index + 1}</td>
                  </tr>
                  {order.items && order.items.map((item: { id: any; quantity: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; name: any; }) => (
                    <tr key={`order-${index}-item-${item.id}`}>
                      <td></td>
                      <td>{item.quantity}</td>
                      <td>{item.name || 'No name provided'}</td>
                      <td>{order.state || 'No state provided'}</td> 
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
  user: state.user,
});
  
const mapDispatchToProps = (dispatch: Dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);