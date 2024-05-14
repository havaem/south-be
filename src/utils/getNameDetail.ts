export const getNameDetail = (name: string) => {
    const nameSplit = name.split(" ");
    return {
        first: nameSplit[nameSplit.length - 1],
        last: nameSplit.slice(0, nameSplit.length - 1).join(" "),
        middle: nameSplit.length > 2 ? nameSplit.slice(1, nameSplit.length - 1).join(" ") : "",
    };
};
