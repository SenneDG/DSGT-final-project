import React from "react";
import DialogModal from "../DialogModal";

import ModalContent from "./ModalContent/ModalContent";

import './AuthModal.scss';

class AuthModal extends DialogModal {
    constructor(){
        super();  
    }

    getModalTitle = () => "Login";

    getModalContent = () => (
        <ModalContent 

        />
    );
}

export default AuthModal;