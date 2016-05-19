/**
 * Removes whitespaces from ends of a string
 * @param {String} string Source string
 * @return {String} 
 */
export const trim = (string) => {
    // @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
    return string.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};
