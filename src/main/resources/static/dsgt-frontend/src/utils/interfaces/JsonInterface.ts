type JSONType =
  | string
  | number
  | boolean
  | { [x: string]: JSONType }
  | Array<JSONType>;

export default JSONType;
