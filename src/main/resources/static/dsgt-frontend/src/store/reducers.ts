import { combineReducers } from 'redux';

import window from './window/slice';
import route from './route/slice';
import modal from './modal/slice';
import language from './language/slice';
import cart from './cart/slice';
import user from './user/slice';

export default combineReducers({
    window,
    route,
    modal,
    language,
    user,
    cart,
});

