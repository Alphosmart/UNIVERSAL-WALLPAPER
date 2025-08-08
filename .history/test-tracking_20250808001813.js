// Simple test to verify tracking number generation
const generateTrackingNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TRK${timestamp}${random}`;
};

console.log('Generated tracking numbers:');
for (let i = 0; i < 5; i++) {
    console.log(generateTrackingNumber());
}
