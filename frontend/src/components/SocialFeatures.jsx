import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaHeart, FaRegHeart, FaStar, FaRegStar, FaShare, FaComment, FaWhatsapp, FaFacebook, FaTwitter, FaTelegramPlane, FaLinkedin, FaInstagram, FaEnvelope, FaLink } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { formatCurrency } from '../helper/settingsUtils';

// Was hardcoded to http://localhost:8080, which broke likes/ratings/share tracking in production.
// common/index.js doesn't export its backend domain, so take it from a known endpoint URL.
const backendDomain = new URL(SummaryApi.current_user.url).origin;

// Platforms the backend's socialShares enum accepts; others are not tracked
const TRACKED_PLATFORMS = ['facebook', 'twitter', 'whatsapp', 'linkedin', 'instagram'];

const SHARE_PLATFORMS = [
    { key: 'whatsapp', label: 'WhatsApp chat', Icon: FaWhatsapp, color: 'text-green-600' },
    { key: 'facebook', label: 'Facebook', Icon: FaFacebook, color: 'text-blue-600' },
    { key: 'twitter', label: 'X (Twitter)', Icon: FaTwitter, color: 'text-gray-800' },
    { key: 'telegram', label: 'Telegram', Icon: FaTelegramPlane, color: 'text-sky-500' },
    { key: 'linkedin', label: 'LinkedIn', Icon: FaLinkedin, color: 'text-blue-700' },
    { key: 'instagram', label: 'Instagram', Icon: FaInstagram, color: 'text-pink-600' },
    { key: 'email', label: 'Email', Icon: FaEnvelope, color: 'text-gray-600' },
    { key: 'copy', label: 'Copy link', Icon: FaLink, color: 'text-gray-600' }
];

const SocialFeatures = ({ product, compact = false }) => {
    const user = useSelector(state => state?.user?.user);
    const [isLiked, setIsLiked] = useState(product.socialFeatures?.likes?.userHasLiked || false);
    const [likeCount, setLikeCount] = useState(product.socialFeatures?.likes?.count || 0);
    const [userRating, setUserRating] = useState(product.socialFeatures?.ratings?.userRating || 0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareImageFile, setShareImageFile] = useState(null);

    const handleLike = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!user?._id) {
            alert('Please login to like products');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${product._id}/like`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setIsLiked(data.data.liked);
                setLikeCount(data.data.totalLikes);
            } else {
                console.error('Failed to like product:', data.message);
                if (data.message.includes('login') || data.message.includes('Authentication')) {
                    alert('Please login to like products');
                }
            }
        } catch (error) {
            console.error('Error liking product:', error);
        }
    };

    const handleRate = async (rating) => {
        if (!user?._id) {
            alert('Please login to rate products');
            return;
        }

        try {
            const response = await fetch(`${backendDomain}/api/products/${product._id}/rate`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ rating })
            });

            const data = await response.json();
            
            if (data.success) {
                setUserRating(rating);
            } else {
                console.error('Failed to rate product:', data.message);
                if (data.message.includes('login') || data.message.includes('Authentication')) {
                    alert('Please login to rate products');
                }
            }
        } catch (error) {
            console.error('Error rating product:', error);
        }
    };

    const rawImage = product.productImage?.[0];
    const shareImage = rawImage && rawImage.startsWith('/uploads') ? `${backendDomain}${rawImage}` : rawImage;
    const fileBaseName = (product.productName || 'listing').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'listing';

    const getShareDetails = () => {
        const url = `${window.location.origin}/product/${product._id}`;
        const title = product.productName || 'Check this out';
        const price = product.sellingPrice || product.price;
        const priceText = price ? formatCurrency(price, product.pricing?.sellingPrice?.currency) : '';
        return { url, title, text: [title, priceText].filter(Boolean).join(' - ') };
    };

    // Load the photo as a File as soon as the menu opens: navigator.share must run
    // right after the tap, so there is no time to download it then
    useEffect(() => {
        if (!showShareModal || !shareImage || shareImageFile) return;
        let cancelled = false;
        // Uploaded photos are stored as data: URLs, which the site's CSP (connect-src)
        // blocks for fetch(), so decode those directly instead
        const loadBlob = async () => {
            if (shareImage.startsWith('data:')) {
                const [header, base64] = shareImage.split(',');
                const type = (header.match(/data:([^;]+)/) || [])[1] || 'image/jpeg';
                const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
                return new Blob([bytes], { type });
            }
            const response = await fetch(shareImage);
            return response.blob();
        };
        loadBlob()
            .then(blob => {
                if (cancelled || !blob.type.startsWith('image/')) return;
                const extension = blob.type.split('/')[1] || 'jpg';
                setShareImageFile(new File([blob], `${fileBaseName}.${extension}`, { type: blob.type }));
            })
            .catch(() => {}); // image host may block cross-origin fetches; share without the photo
        return () => { cancelled = true; };
    }, [showShareModal, shareImage, shareImageFile, fileBaseName]);

    const trackShare = (platform) => {
        if (!user?._id || !TRACKED_PLATFORMS.includes(platform)) return;
        fetch(`${backendDomain}/api/products/${product._id}/share`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ platform })
        }).catch(console.error);
    };

    const copyToClipboard = async (value, message) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
        }
        toast.success(message);
    };

    // The phone's share sheet is the only way a website can reach WhatsApp Status,
    // Instagram/Facebook Stories and other installed apps
    const handleNativeShare = async () => {
        const { url, title, text } = getShareDetails();
        if (!navigator.share) {
            await copyToClipboard(url, 'Link copied! To post to WhatsApp Status, open this page on your phone and tap Share.');
            return;
        }
        const withImage = shareImageFile && navigator.canShare?.({ files: [shareImageFile] });
        try {
            // Apps often drop the url field when a file is attached, so the link goes in the text too
            await navigator.share(withImage
                ? { files: [shareImageFile], title, text: `${text}\n${url}` }
                : { title, text, url });
            trackShare('whatsapp');
            setShowShareModal(false);
        } catch (error) {
            if (error?.name !== 'AbortError') {
                await copyToClipboard(url, 'Sharing is not available here, so the link was copied instead.');
            }
        }
    };

    const handleShare = async (platform) => {
        const { url, title, text } = getShareDetails();
        const shareUrls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n${url}`)}`
        };

        if (platform === 'copy') {
            await copyToClipboard(url, 'Link copied to clipboard!');
        } else if (platform === 'instagram') {
            // Instagram has no web share link: copy the link, then open Instagram
            await copyToClipboard(url, 'Link copied - paste it into your Instagram post or story.');
            window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
        } else if (platform === 'email') {
            window.location.href = shareUrls.email;
        } else {
            window.open(shareUrls[platform], '_blank', 'noopener,noreferrer');
        }

        trackShare(platform);
        setShowShareModal(false);
    };

    // Rendered in a portal so clicks don't reach a surrounding card <Link>
    const shareModal = showShareModal && createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            onClick={(e) => { e.stopPropagation(); setShowShareModal(false); }}
        >
            <div className="bg-white p-6 rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-semibold">Share</h3>
                <p className="text-sm text-gray-500 mb-4 truncate">{product.productName}</p>

                <button
                    onClick={handleNativeShare}
                    className="w-full p-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <FaWhatsapp /> WhatsApp Status, Stories &amp; more
                </button>
                <p className="text-xs text-gray-500 mt-2 mb-4">
                    Opens your phone's share menu with the photo. Choose WhatsApp → My status, or Instagram / Facebook Stories.
                </p>

                <div className="grid grid-cols-2 gap-2">
                    {SHARE_PLATFORMS.map(({ key, label, Icon, color }) => (
                        <button
                            key={key}
                            onClick={() => handleShare(key)}
                            className="flex items-center gap-2 p-3 rounded-lg border hover:bg-gray-50 transition-colors text-sm text-left"
                        >
                            <Icon className={color} /> {label}
                        </button>
                    ))}
                </div>

                {shareImage && (
                    <a
                        href={shareImage}
                        download={`${fileBaseName}.jpg`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full mt-3 p-3 text-center rounded-lg border hover:bg-gray-50 transition-colors text-sm"
                    >
                        Download photo (to post on your Status)
                    </a>
                )}

                <button
                    onClick={() => setShowShareModal(false)}
                    className="w-full mt-4 p-2 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>,
        document.body
    );

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
                <span
                    key={index}
                    className={`${interactive ? 'cursor-pointer hover:text-yellow-400' : ''} ${
                        starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => interactive && onStarClick && onStarClick(starValue)}
                >
                    {starValue <= rating ? <FaStar size={16} /> : <FaRegStar size={16} />}
                </span>
            );
        });
    };

    if (compact) {
        // Compact version for product cards
        return (
            <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLike}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                    >
                        {isLiked ? <FaHeart className="text-red-500" size={14} /> : <FaRegHeart size={14} />}
                        <span>{likeCount}</span>
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {renderStars(product.socialFeatures?.averageRating || 0)}
                        <span className="ml-1">({product.socialFeatures?.totalRatings || 0})</span>
                    </div>
                </div>
                
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowShareModal(true);
                    }}
                    className="hover:text-blue-500 transition-colors"
                >
                    <FaShare size={14} />
                </button>
                {shareModal}
            </div>
        );
    }

    // Full version for product detail page
    return (
        <div className="space-y-4">
            {/* Like and Share buttons */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                    {isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    <span>{isLiked ? 'Liked' : 'Like'} ({likeCount})</span>
                </button>
                
                <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                    <FaShare />
                    <span>Share</span>
                </button>
            </div>

            {/* Rating section */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Rating:</span>
                    <div className="flex items-center gap-1">
                        {renderStars(product.socialFeatures?.ratings?.average || 0)}
                        <span className="ml-2 text-gray-600">
                            {product.socialFeatures?.ratings?.average || 0} 
                            ({product.socialFeatures?.ratings?.total || 0} reviews)
                        </span>
                    </div>
                </div>
                
                {user?._id && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Your rating:</span>
                        <div className="flex items-center gap-1">
                            {renderStars(userRating, true, (rating) => setUserRating(rating))}
                        </div>
                        <button
                            onClick={() => handleRate(userRating)}
                            className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            disabled={userRating === 0}
                        >
                            Rate
                        </button>
                    </div>
                )}
            </div>

            {/* Reviews count */}
            <div className="flex items-center gap-2 text-gray-600">
                <FaComment />
                <span>{product.socialFeatures?.reviews?.count || 0} reviews</span>
            </div>

            {shareModal}
        </div>
    );
};

export default SocialFeatures;
