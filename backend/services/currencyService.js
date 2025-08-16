// Currency conversion service for multi-currency support

// Mock exchange rates (in a real app, you'd use an API like exchangerate-api.com)
const EXCHANGE_RATES = {
    // Base rates relative to USD
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    NGN: 1650.0,
    ZAR: 18.50,
    EGP: 49.0,
    KES: 129.0,
    GHS: 15.8,
    MAD: 10.2,
    ETB: 111.0,
    TND: 3.1,
    DZD: 135.0,
    CAD: 1.35,
    INR: 83.0,
    AED: 3.67,
    JPY: 145.0
};

// Last update timestamp for exchange rates
let lastRateUpdate = new Date();

class CurrencyService {
    static getExchangeRate(fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) return 1.0;
        
        const fromRate = EXCHANGE_RATES[fromCurrency];
        const toRate = EXCHANGE_RATES[toCurrency];
        
        if (!fromRate || !toRate) {
            console.warn(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
            return 1.0; // Fallback to 1:1 if rate not found
        }
        
        // Convert through USD as base currency
        return toRate / fromRate;
    }
    
    static convertPrice(amount, fromCurrency, toCurrency) {
        const rate = this.getExchangeRate(fromCurrency, toCurrency);
        return Math.round(amount * rate * 100) / 100; // Round to 2 decimal places
    }
    
    static convertProductPricing(product, targetCurrency) {
        if (!product.pricing || !product.pricing.originalPrice) {
            // Handle legacy products
            return {
                originalPrice: this.convertPrice(product.price || 0, 'NGN', targetCurrency),
                sellingPrice: this.convertPrice(product.sellingPrice || 0, 'NGN', targetCurrency),
                currency: targetCurrency,
                isConverted: true,
                sourceCurrency: 'NGN'
            };
        }
        
        const sourceCurrency = product.pricing.originalPrice.currency;
        
        if (sourceCurrency === targetCurrency) {
            return {
                originalPrice: product.pricing.originalPrice.amount,
                sellingPrice: product.pricing.sellingPrice.amount,
                currency: targetCurrency,
                isConverted: false,
                sourceCurrency: sourceCurrency
            };
        }
        
        return {
            originalPrice: this.convertPrice(
                product.pricing.originalPrice.amount, 
                sourceCurrency, 
                targetCurrency
            ),
            sellingPrice: this.convertPrice(
                product.pricing.sellingPrice.amount, 
                sourceCurrency, 
                targetCurrency
            ),
            currency: targetCurrency,
            isConverted: true,
            sourceCurrency: sourceCurrency
        };
    }
    
    static updateCachedPrices(product) {
        if (!product.pricing || !product.pricing.originalPrice) return product;
        
        const sourceCurrency = product.pricing.originalPrice.currency;
        const commonCurrencies = ['USD', 'EUR', 'NGN', 'GBP'];
        
        if (!product.pricing.convertedPrices) {
            product.pricing.convertedPrices = {};
        }
        
        commonCurrencies.forEach(targetCurrency => {
            if (targetCurrency === sourceCurrency) {
                // Same currency, copy original values
                product.pricing.convertedPrices[targetCurrency] = {
                    originalPrice: product.pricing.originalPrice.amount,
                    sellingPrice: product.pricing.sellingPrice.amount,
                    lastUpdated: new Date()
                };
            } else {
                // Convert prices
                product.pricing.convertedPrices[targetCurrency] = {
                    originalPrice: this.convertPrice(
                        product.pricing.originalPrice.amount,
                        sourceCurrency,
                        targetCurrency
                    ),
                    sellingPrice: this.convertPrice(
                        product.pricing.sellingPrice.amount,
                        sourceCurrency,
                        targetCurrency
                    ),
                    lastUpdated: new Date()
                };
            }
        });
        
        return product;
    }
    
    static shouldUpdateRates() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return lastRateUpdate < oneHourAgo;
    }
    
    // In a real app, this would fetch from an external API
    static async updateExchangeRates() {
        // Mock implementation - in production, call external API
        console.log('Exchange rates updated at:', new Date());
        lastRateUpdate = new Date();
        return true;
    }
    
    static getSupportedCurrencies() {
        return Object.keys(EXCHANGE_RATES);
    }
    
    static isCurrencySupported(currency) {
        return currency && EXCHANGE_RATES.hasOwnProperty(currency);
    }
    
    static getCurrencySymbol(currency) {
        const symbols = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            NGN: '₦',
            ZAR: 'R',
            EGP: 'E£',
            KES: 'KSh',
            GHS: 'GH₵',
            MAD: 'MAD',
            ETB: 'Br',
            TND: 'TND',
            DZD: 'DA',
            CAD: 'C$',
            INR: '₹',
            AED: 'AED',
            JPY: '¥'
        };
        return symbols[currency] || currency;
    }
    
    static formatPrice(amount, currency) {
        const symbol = this.getCurrencySymbol(currency);
        
        // Format based on currency
        if (currency === 'JPY') {
            // Japanese Yen doesn't use decimal places
            return `${symbol}${Math.round(amount).toLocaleString()}`;
        } else if (['NGN', 'KES', 'ETB'].includes(currency)) {
            // African currencies often display without decimals for whole amounts
            return amount % 1 === 0 
                ? `${symbol}${amount.toLocaleString()}`
                : `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            // Most currencies use 2 decimal places
            return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }
}

module.exports = CurrencyService;
