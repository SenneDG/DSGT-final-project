import ApiKey from '../../ApiKey';
import UrlParser from '../../../parsers/urlParser';
import { createQuery } from '../../../parsers/queryParser';


export default {
    getHello: UrlParser([ApiKey.general, ApiKey.getHello]),
    getAllShopItems: UrlParser([ApiKey.general, ApiKey.getAllShopItems]),
    checkout: UrlParser([ApiKey.general, ApiKey.checkout]),
};
