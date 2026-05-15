const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
}

const DEFAULT_CURRENCY = 'INR'

export const getCurrencySymbol = (code = DEFAULT_CURRENCY) =>
  CURRENCIES[code]?.symbol || CURRENCIES[DEFAULT_CURRENCY].symbol

export const formatCurrency = (amount, code = DEFAULT_CURRENCY) =>
  `${getCurrencySymbol(code)}${amount || 0}`

export { CURRENCIES, DEFAULT_CURRENCY }
