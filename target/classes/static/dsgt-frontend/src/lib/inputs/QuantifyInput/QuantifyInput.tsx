import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import ButtonDiv from '../../fragments/ButtonDiv/ButtonDiv';

import './QuantifyInput.scss';

interface QuantifyInputProps {
    quantity: number;
    setQuantity: (quantity: number) => void;
    maxQuantity?: number;
}
  

const QuantifyInput: React.FC<QuantifyInputProps> = ({ quantity, setQuantity, maxQuantity }) => {
    const increaseQuantity = () => {
        const max = maxQuantity || Infinity;
        if (quantity < max) {
          setQuantity(quantity + 1);
        }
      };
    
    const decreaseQuantity = () => {
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
    };

    return (
        <div className="quantity-input">
            <ButtonDiv className="quantity-button" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <FiMinus />
            </ButtonDiv>
            <div className='quantity-number'>{quantity}</div>
            <ButtonDiv className="quantity-button" onClick={increaseQuantity} disabled={quantity >= (maxQuantity || Infinity)}>
                <FiPlus />
            </ButtonDiv>
        </div>
    );
};

export default QuantifyInput;