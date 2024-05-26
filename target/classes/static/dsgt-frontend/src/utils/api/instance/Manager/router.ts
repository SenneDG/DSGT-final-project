import ApiKey from '../../ApiKey';
import UrlParser from '../../../parsers/urlParser';
import { createQuery } from '../../../parsers/queryParser';


export default {
    getOrders: UrlParser([ApiKey.manager, ApiKey.orders]),
};