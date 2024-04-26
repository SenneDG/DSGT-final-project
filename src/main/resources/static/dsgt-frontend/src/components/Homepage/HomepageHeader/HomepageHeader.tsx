import React from "react";
import ButtonDiv from "../../../lib/fragments/ButtonDiv/ButtonDiv";

import './HomepageHeader.scss';
import Modal from "../../../lib/fragments/Modal/Modal";
import ModalHelper from "../../../utils/helpers/ModalHelper";

interface State {}

interface MapStateToProps {}

interface DispatchProps {}

interface OwnProps {}

type Props = MapStateToProps & DispatchProps & OwnProps;
class HomepageHeader extends React.PureComponent<Props, State> {
  render() {
    return (
      <div className="homepage-header">
        <h1 className="title">DSGT Broker</h1>
      </div>
    );
  }
}

export default HomepageHeader;