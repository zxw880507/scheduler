import reducer from "reducers/application";

describe('throws an error with an unsupported type', () => {
  test('should throw an error with type as "undefined"', () => {
    expect(() => reducer({}, {type: null})).toThrowError(
      /tried to reduce with unsupported action type/i
    );
  });
  
});