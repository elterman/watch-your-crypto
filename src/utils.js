
export const formatCurrency = (value, precision ) => {
    return Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: precision,
    }).format(value);
};

export const formatPercent = (value ) => {
    return Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};
