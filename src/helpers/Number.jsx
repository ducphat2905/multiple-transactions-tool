const parseToDecimalVal = (num, decimal) => {
    if (!decimal) throw new Error("decimal is not found")
    return num / 10 ** decimal
}

const parseFromDecimalVal = (num, decimal) => {
    if (!decimal) throw new Error("decimal is not found")
    return num * 10 ** decimal
}

const convertNumToFullString = (num) => {
    return num.toLocaleString("fullwide", { useGrouping: false })
}

export default { parseToDecimalVal, parseFromDecimalVal, convertNumToFullString }
