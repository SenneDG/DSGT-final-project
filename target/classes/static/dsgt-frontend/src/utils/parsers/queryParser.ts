/**
 * Create the query path from the query object
 * @param {Object} queryObject - the query object
 * @return {string} - the string of the query path
 */
export const createQuery = (queryObject: any) => {
    let queryPath = '';
    const keys = Object.keys(queryObject);
    keys.forEach((key, index) => {
      const prefix = index === 0 ? '?' : '&';
      queryPath += `${prefix}${key}=${queryObject[key]}`;
    });
    return queryPath;
  };
  
  export default {};
  