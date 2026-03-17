const MOBILE_USER_AGENT_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export const normalizeWhatsAppNumber = (rawNumber) => {
    if (!rawNumber) return '';

    let digitsOnly = String(rawNumber).replace(/\D/g, '');
    if (!digitsOnly) return '';

    if (digitsOnly.startsWith('0')) {
        digitsOnly = `234${digitsOnly.slice(1)}`;
    }

    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return '';
    }

    return digitsOnly;
};

export const resolveWhatsAppNumber = ({ siteContent, item }) => {
    const numberCandidates = [
        siteContent?.contactUs?.businessInfo?.whatsapp,
        item?.agent?.phone,
        item?.agentPhone,
        item?.uploadedBy?.phone,
        item?.uploader?.phone,
        item?.uploadedByInfo?.phone,
        item?.seller?.phone,
        item?.sellerInfo?.phone,
        item?.companyInfo?.phone,
        item?.companyId?.phone
    ];

    for (const candidate of numberCandidates) {
        const normalized = normalizeWhatsAppNumber(candidate);
        if (normalized) {
            return normalized;
        }
    }

    return '';
};

const formatPriceWithThousandsSeparator = (price) => {
    const numericPrice = Number(price);
    if (Number.isFinite(numericPrice)) {
        return numericPrice.toLocaleString('en-US');
    }

    return String(price || '');
};

const getCanonicalOrigin = () => {
    const { origin, hostname } = window.location;
    if (origin.startsWith('http://') && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return origin.replace('http://', 'https://');
    }

    return origin;
};

export const buildProductUrl = ({ itemType, itemId }) => {
    const baseOrigin = getCanonicalOrigin();
    if (itemType === 'property') {
        return `${baseOrigin}/property/${itemId}`;
    }

    return `${baseOrigin}/product/${itemId}`;
};

export const buildWhatsAppProductMessage = ({ title, price, location, productUrl }) => {
    const lines = [
        'Hello, I am interested in this product.',
        `Product: ${title || ''}`,
        `Price: ${formatPriceWithThousandsSeparator(price)}`
    ];

    if (location) {
        lines.push(`Location: ${location}`);
    }

    lines.push('', productUrl);

    return lines.join('\n');
};

export const openWhatsAppProductChat = ({ siteContent, item, itemType = 'product', itemId, title, price, location }) => {
    const phoneNumber = resolveWhatsAppNumber({ siteContent, item });
    if (!phoneNumber) {
        return false;
    }

    const productUrl = buildProductUrl({ itemType, itemId });
    const message = buildWhatsAppProductMessage({
        title,
        price,
        location,
        productUrl
    });

    const encodedMessage = encodeURIComponent(message);
    const isMobileDevice = MOBILE_USER_AGENT_REGEX.test(navigator.userAgent);
    const whatsappUrl = isMobileDevice
        ? `https://wa.me/${phoneNumber}?text=${encodedMessage}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    return true;
};
