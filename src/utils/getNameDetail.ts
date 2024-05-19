/**
 *
 * @param name name to get detail
 * @returns object with first, last, middle name
 */
export const getNameDetail = (name: string) => {
    const nameSplit = name.split(" ");
    return {
        first: nameSplit.pop(),
        last: nameSplit.shift(),
        middle: nameSplit.join(" "),
    };
};
