const idNumberCheck = (userIdNumber: string) => {
    let id = userIdNumber.trim();
  
    const convert = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
    const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  
    id = String(convert.indexOf(id[0]) + 10) + id.slice(1);
  
    let checkSum = 0;
  
    for (let i = 0; i < id.length; i += 1) {
      const c = parseInt(id[i], 10);
      const w = weights[i];
      checkSum += c * w;
    }
  
    return checkSum % 10 === 0;
  };
  
  export default {
    idNumberCheck,
  };
  