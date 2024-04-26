import { ReactElement } from 'react';
import store from '../../store/store';

/**
 * Represents a modal.
 * @class
 */
class BaseModal {
  protected language: any;

  constructor() {
    this.language = store.getState().language.languageInfo.languageObject.modal;
  }

  /**
   * Closes the modal.
   * @function
   */
  onClose = () => {};

  /**
   * Gets the title of the modal.
   * @function
   * @return {string} -  the title of the modal
   */
  getModalTitle: () => ReactElement | string = () => '';

  /**
   * Gets the content of the modal.
   * @function
   * @return {ReactElement | string} -  the content of the modal
   */
  getModalContent: () => ReactElement | string = () => '';
}

export default BaseModal;
