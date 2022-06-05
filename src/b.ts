/**
 * Adds all the values in an array.
 * @param  {Array} arr an array of numbers
 * @return {Number}    the sum of all the array values
 */
 const addArray = (arr: any[]) => {
    const result = arr.reduce((a: any, b: any) => a + b, 0);
    return result;
  };
  export default addArray;