const settingsModel = require('../models/settingsModel');

// Get payment configuration
const getPaymentConfiguration = async (req, res) => {
    try {
        // Check if user is admin
        if (req.userId && req.userRole !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        // Get settings from database or use defaults
        const settings = await settingsModel.getSettings();
        
        // Return payment configuration using consolidated structure
        const paymentConfig = {
            methods: settings?.payment?.methods || {
                stripe: {
                    enabled: true,
                    name: 'Credit/Debit Cards',
                    description: 'Accept all major credit and debit cards',
                    processingFee: 2.9,
                    additionalFee: 0.30,
                    currency: 'USD',
                    testMode: true,
                    publicKey: '',
                    secretKey: '',
                    webhookSecret: '',
                    supportedCountries: ['US', 'CA', 'GB', 'AU'],
                    capabilities: ['instant_transfer', 'refunds', 'recurring']
                },
                paypal: {
                    enabled: true,
                    name: 'PayPal',
                    description: 'Pay with PayPal account or PayPal Credit',
                    processingFee: 3.4,
                    additionalFee: 0.30,
                    currency: 'USD',
                    testMode: true,
                    clientId: '',
                    clientSecret: '',
                    supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
                    capabilities: ['buyer_protection', 'refunds', 'recurring']
                },
                paystack: {
                    enabled: settings?.payment?.paymentMethodSettings?.paystack?.enabled ?? false,
                    name: 'Paystack',
                    description: 'African payment gateway supporting multiple methods',
                    processingFee: settings?.payment?.paymentMethodSettings?.paystack?.processingFee ?? 1.5,
                    additionalFee: settings?.payment?.paymentMethodSettings?.paystack?.additionalFee ?? 100,
                    currency: 'NGN',
                    testMode: settings?.payment?.paymentMethodSettings?.paystack?.testMode ?? true,
                    publicKey: settings?.payment?.paymentMethodSettings?.paystack?.publicKey ?? '',
                    secretKey: settings?.payment?.paymentMethodSettings?.paystack?.secretKey ?? '',
                    supportedCountries: ['NG', 'GH', 'ZA', 'KE'],
                    capabilities: ['bank_transfer', 'ussd', 'qr_code', 'mobile_money']
                },
                flutterwave: {
                    enabled: settings?.payment?.paymentMethodSettings?.flutterwave?.enabled ?? false,
                    name: 'Flutterwave',
                    description: 'Pan-African payment platform',
                    processingFee: settings?.payment?.paymentMethodSettings?.flutterwave?.processingFee ?? 1.4,
                    additionalFee: settings?.payment?.paymentMethodSettings?.flutterwave?.additionalFee ?? 0,
                    currency: 'NGN',
                    testMode: settings?.payment?.paymentMethodSettings?.flutterwave?.testMode ?? true,
                    publicKey: settings?.payment?.paymentMethodSettings?.flutterwave?.publicKey ?? '',
                    secretKey: settings?.payment?.paymentMethodSettings?.flutterwave?.secretKey ?? '',
                    encryptionKey: settings?.payment?.paymentMethodSettings?.flutterwave?.encryptionKey ?? '',
                    supportedCountries: ['NG', 'GH', 'KE', 'UG', 'ZA'],
                    capabilities: ['bank_transfer', 'ussd', 'mobile_money', 'cards']
                },
                cashOnDelivery: {
                    enabled: settings?.payment?.enableCashOnDelivery ?? true,
                    name: 'Cash on Delivery',
                    description: 'Pay when your order is delivered',
                    processingFee: 0,
                    additionalFee: settings?.payment?.paymentMethodSettings?.cashOnDelivery?.additionalFee ?? 50,
                    currency: 'NGN',
                    maxAmount: settings?.payment?.paymentMethodSettings?.cashOnDelivery?.maxAmount ?? 50000,
                    availableCountries: settings?.payment?.paymentMethodSettings?.cashOnDelivery?.availableCountries ?? ['NG', 'GH'],
                    deliveryAreas: settings?.payment?.paymentMethodSettings?.cashOnDelivery?.deliveryAreas ?? ['Lagos', 'Abuja', 'Port Harcourt', 'Kano'],
                    verificationRequired: settings?.payment?.paymentMethodSettings?.cashOnDelivery?.verificationRequired ?? true
                },
                bankTransfer: {
                    enabled: settings?.payment?.enableBankTransfer ?? true,
                    name: 'Bank Transfer',
                    description: 'Direct bank transfer payment',
                    processingFee: 0,
                    additionalFee: 0,
                    currency: 'NGN',
                    bankAccounts: settings?.payment?.paymentMethodSettings?.bankTransfer?.bankAccounts ?? [
                        {
                            bankName: 'First Bank of Nigeria',
                            accountName: 'Universal Wallpaper Ltd',
                            accountNumber: '1234567890',
                            sortCode: '011151003'
                        }
                    ],
                    autoVerification: settings?.payment?.paymentMethodSettings?.bankTransfer?.autoVerification ?? false,
                    verificationTimeframe: settings?.payment?.paymentMethodSettings?.bankTransfer?.verificationTimeframe ?? 24
                },
                cryptocurrency: {
                    enabled: settings?.payment?.enableCryptocurrency ?? false,
                    name: 'Cryptocurrency',
                    description: 'Bitcoin, Ethereum, and other digital currencies',
                    processingFee: settings?.payment?.paymentMethodSettings?.cryptocurrency?.processingFee ?? 1.0,
                    additionalFee: 0,
                    supportedCoins: settings?.payment?.paymentMethodSettings?.cryptocurrency?.supportedCoins ?? ['BTC', 'ETH', 'USDT', 'USDC'],
                    wallet: settings?.payment?.paymentMethodSettings?.cryptocurrency?.wallet ?? {
                        btc: '',
                        eth: '',
                        usdt: '',
                        usdc: ''
                    },
                    autoConfirmation: settings?.payment?.paymentMethodSettings?.cryptocurrency?.autoConfirmation ?? 3,
                    network: settings?.payment?.paymentMethodSettings?.cryptocurrency?.network ?? 'mainnet'
                }
            },
            general: {
                defaultCurrency: settings?.payment?.defaultCurrency ?? 'NGN',
                minimumAmount: settings?.payment?.minimumAmount ?? 100,
                maximumAmount: settings?.payment?.maximumAmount ?? 1000000,
                commission: {
                    percentage: settings?.payment?.commissionRate ?? 2.5,
                    flatFee: settings?.payment?.commissionFlatFee ?? 0,
                    sellerPaysCommission: settings?.payment?.sellerPaysCommission ?? true
                },
                payout: {
                    schedule: settings?.payment?.payoutSchedule ?? 'weekly',
                    minimumPayout: settings?.payment?.minimumPayout ?? 1000,
                    payoutDay: settings?.payment?.payoutDay ?? 'friday',
                    autoPayouts: settings?.payment?.autoPayouts ?? true
                },
                refunds: {
                    enabled: settings?.payment?.refundsEnabled ?? true,
                    timeframe: settings?.payment?.refundTimeframe ?? 7,
                    autoRefunds: settings?.payment?.autoRefunds ?? false,
                    refundPolicy: settings?.payment?.refundPolicy ?? 'Returns accepted within 7 days of delivery'
                },
                notifications: {
                    paymentSuccess: settings?.payment?.notifications?.paymentSuccess ?? true,
                    paymentFailure: settings?.payment?.notifications?.paymentFailure ?? true,
                    payoutProcessed: settings?.payment?.notifications?.payoutProcessed ?? true,
                    refundIssued: settings?.payment?.notifications?.refundIssued ?? true
                }
            }
        };

        res.json({
            message: "Payment configuration retrieved successfully",
            error: false,
            success: true,
            data: paymentConfig
        });

    } catch (error) {
        console.error('Get payment configuration error:', error);
        res.status(500).json({
            message: error.message || "Error retrieving payment configuration",
            error: true,
            success: false
        });
    }
};

// Update payment configuration
const updatePaymentConfiguration = async (req, res) => {
    try {
        // Check if user is admin
        if (req.userId && req.userRole !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        const paymentConfig = req.body;
        
        if (!paymentConfig) {
            return res.status(400).json({
                message: "Payment configuration data is required",
                error: true,
                success: false
            });
        }

        // Get current settings or create new
        let settings = await settingsModel.getSettings() || {};

        // Update payment settings structure
        const updatedPaymentSettings = {
            enableStripe: paymentConfig.methods?.stripe?.enabled ?? true,
            enablePayPal: paymentConfig.methods?.paypal?.enabled ?? true,
            enableCashOnDelivery: paymentConfig.methods?.cashOnDelivery?.enabled ?? true,
            enableBankTransfer: paymentConfig.methods?.bankTransfer?.enabled ?? true,
            enableCryptocurrency: paymentConfig.methods?.cryptocurrency?.enabled ?? false,
            
            // General settings
            defaultCurrency: paymentConfig.general?.defaultCurrency ?? 'NGN',
            minimumAmount: paymentConfig.general?.minimumAmount ?? 100,
            maximumAmount: paymentConfig.general?.maximumAmount ?? 1000000,
            commissionRate: paymentConfig.general?.commission?.percentage ?? 2.5,
            commissionFlatFee: paymentConfig.general?.commission?.flatFee ?? 0,
            sellerPaysCommission: paymentConfig.general?.commission?.sellerPaysCommission ?? true,
            
            // Payout settings
            payoutSchedule: paymentConfig.general?.payout?.schedule ?? 'weekly',
            minimumPayout: paymentConfig.general?.payout?.minimumPayout ?? 1000,
            payoutDay: paymentConfig.general?.payout?.payoutDay ?? 'friday',
            autoPayouts: paymentConfig.general?.payout?.autoPayouts ?? true,
            
            // Refund settings
            refundsEnabled: paymentConfig.general?.refunds?.enabled ?? true,
            refundTimeframe: paymentConfig.general?.refunds?.timeframe ?? 7,
            autoRefunds: paymentConfig.general?.refunds?.autoRefunds ?? false,
            refundPolicy: paymentConfig.general?.refunds?.refundPolicy ?? 'Returns accepted within 7 days of delivery',
            
            // Notification settings
            notifications: {
                paymentSuccess: paymentConfig.general?.notifications?.paymentSuccess ?? true,
                paymentFailure: paymentConfig.general?.notifications?.paymentFailure ?? true,
                payoutProcessed: paymentConfig.general?.notifications?.payoutProcessed ?? true,
                refundIssued: paymentConfig.general?.notifications?.refundIssued ?? true
            },

            // Payment method specific settings
            paymentMethodSettings: {
                stripe: {
                    enabled: paymentConfig.methods?.stripe?.enabled ?? true,
                    processingFee: paymentConfig.methods?.stripe?.processingFee ?? 2.9,
                    additionalFee: paymentConfig.methods?.stripe?.additionalFee ?? 0.30,
                    testMode: paymentConfig.methods?.stripe?.testMode ?? true,
                    publicKey: paymentConfig.methods?.stripe?.publicKey ?? '',
                    secretKey: paymentConfig.methods?.stripe?.secretKey ?? '',
                    webhookSecret: paymentConfig.methods?.stripe?.webhookSecret ?? ''
                },
                paypal: {
                    enabled: paymentConfig.methods?.paypal?.enabled ?? true,
                    processingFee: paymentConfig.methods?.paypal?.processingFee ?? 3.4,
                    additionalFee: paymentConfig.methods?.paypal?.additionalFee ?? 0.30,
                    testMode: paymentConfig.methods?.paypal?.testMode ?? true,
                    clientId: paymentConfig.methods?.paypal?.clientId ?? '',
                    clientSecret: paymentConfig.methods?.paypal?.clientSecret ?? ''
                },
                paystack: {
                    enabled: paymentConfig.methods?.paystack?.enabled ?? false,
                    processingFee: paymentConfig.methods?.paystack?.processingFee ?? 1.5,
                    additionalFee: paymentConfig.methods?.paystack?.additionalFee ?? 100,
                    testMode: paymentConfig.methods?.paystack?.testMode ?? true,
                    publicKey: paymentConfig.methods?.paystack?.publicKey ?? '',
                    secretKey: paymentConfig.methods?.paystack?.secretKey ?? ''
                },
                flutterwave: {
                    enabled: paymentConfig.methods?.flutterwave?.enabled ?? false,
                    processingFee: paymentConfig.methods?.flutterwave?.processingFee ?? 1.4,
                    additionalFee: paymentConfig.methods?.flutterwave?.additionalFee ?? 0,
                    testMode: paymentConfig.methods?.flutterwave?.testMode ?? true,
                    publicKey: paymentConfig.methods?.flutterwave?.publicKey ?? '',
                    secretKey: paymentConfig.methods?.flutterwave?.secretKey ?? '',
                    encryptionKey: paymentConfig.methods?.flutterwave?.encryptionKey ?? ''
                },
                cashOnDelivery: {
                    enabled: paymentConfig.methods?.cashOnDelivery?.enabled ?? true,
                    additionalFee: paymentConfig.methods?.cashOnDelivery?.additionalFee ?? 50,
                    maxAmount: paymentConfig.methods?.cashOnDelivery?.maxAmount ?? 50000,
                    availableCountries: paymentConfig.methods?.cashOnDelivery?.availableCountries ?? ['NG', 'GH'],
                    deliveryAreas: paymentConfig.methods?.cashOnDelivery?.deliveryAreas ?? ['Lagos', 'Abuja'],
                    verificationRequired: paymentConfig.methods?.cashOnDelivery?.verificationRequired ?? true
                },
                bankTransfer: {
                    enabled: paymentConfig.methods?.bankTransfer?.enabled ?? true,
                    bankAccounts: paymentConfig.methods?.bankTransfer?.bankAccounts ?? [],
                    autoVerification: paymentConfig.methods?.bankTransfer?.autoVerification ?? false,
                    verificationTimeframe: paymentConfig.methods?.bankTransfer?.verificationTimeframe ?? 24
                },
                cryptocurrency: {
                    enabled: paymentConfig.methods?.cryptocurrency?.enabled ?? false,
                    processingFee: paymentConfig.methods?.cryptocurrency?.processingFee ?? 1.0,
                    supportedCoins: paymentConfig.methods?.cryptocurrency?.supportedCoins ?? ['BTC', 'ETH'],
                    wallet: paymentConfig.methods?.cryptocurrency?.wallet ?? {},
                    autoConfirmation: paymentConfig.methods?.cryptocurrency?.autoConfirmation ?? 3,
                    network: paymentConfig.methods?.cryptocurrency?.network ?? 'mainnet'
                }
            }
        };

        // Merge with existing settings
        const mergedSettings = {
            ...settings,
            payment: updatedPaymentSettings
        };

        // Save settings
        await settingsModel.updateSettings(mergedSettings);

        res.json({
            message: "Payment configuration updated successfully",
            error: false,
            success: true,
            data: paymentConfig
        });

    } catch (error) {
        console.error('Update payment configuration error:', error);
        res.status(500).json({
            message: error.message || "Error updating payment configuration",
            error: true,
            success: false
        });
    }
};

// Test payment method connection
const testPaymentMethod = async (req, res) => {
    try {
        const { method, credentials } = req.body;

        // Check if user is admin
        if (req.userId && req.userRole !== 'ADMIN') {
            return res.status(403).json({
                message: "Access denied. Admin privileges required.",
                error: true,
                success: false
            });
        }

        let testResult = { success: false, message: 'Unknown payment method' };

        switch (method) {
            case 'stripe':
                if (credentials.secretKey && credentials.secretKey.startsWith('sk_')) {
                    try {
                        const stripe = require('stripe')(credentials.secretKey);
                        const account = await stripe.accounts.retrieve();
                        testResult = {
                            success: true,
                            message: 'Stripe connection successful',
                            details: {
                                accountId: account.id,
                                country: account.country,
                                currency: account.default_currency
                            }
                        };
                    } catch (error) {
                        testResult = {
                            success: false,
                            message: `Stripe connection failed: ${error.message}`
                        };
                    }
                } else {
                    testResult = {
                        success: false,
                        message: 'Invalid Stripe secret key format'
                    };
                }
                break;

            case 'paypal':
                testResult = {
                    success: true,
                    message: 'PayPal configuration saved (test connection not implemented)',
                    details: {
                        clientId: credentials.clientId ? 'Configured' : 'Not configured'
                    }
                };
                break;

            case 'paystack':
                testResult = {
                    success: true,
                    message: 'Paystack configuration saved (test connection not implemented)',
                    details: {
                        publicKey: credentials.publicKey ? 'Configured' : 'Not configured'
                    }
                };
                break;

            default:
                testResult = {
                    success: false,
                    message: `Testing not implemented for ${method}`
                };
        }

        res.json({
            message: "Payment method test completed",
            error: !testResult.success,
            success: testResult.success,
            data: testResult
        });

    } catch (error) {
        console.error('Test payment method error:', error);
        res.status(500).json({
            message: error.message || "Error testing payment method",
            error: true,
            success: false
        });
    }
};

module.exports = {
    getPaymentConfiguration,
    updatePaymentConfiguration,
    testPaymentMethod
};