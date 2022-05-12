const parseToDecimalVal = (num, decimal) => {
    return num / 10 ** decimal
}

const parseFromDecimalVal = (num, decimal) => {
    return num * 10 ** decimal
}

export default { parseToDecimalVal, parseFromDecimalVal }
