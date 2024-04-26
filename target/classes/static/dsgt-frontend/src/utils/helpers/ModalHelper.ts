import store from "../../store/store";

import AuthModal from "../modals/DialogModal/AuthModal/AuthModal";

import {
    openDialogModal,
    reserveOpenDialogModal,
} from "../../store/modal/slice";
import ErrorModal from "../modals/DialogModal/ErrorModal/ErrorModal";

const openAuthModal = () => {
    const authModal = new AuthModal();
    store.dispatch(openDialogModal(authModal));
}

const openErrorModal = ({ message }: any) => {
    const errorModal = new ErrorModal(message);
    store.dispatch(reserveOpenDialogModal(errorModal));
  };
  

export default {
    openAuthModal,
    openErrorModal,
}

