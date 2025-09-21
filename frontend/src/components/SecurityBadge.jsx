import React from 'react';
import { FaShieldAlt, FaLock, FaCertificate, FaCheckCircle } from 'react-icons/fa';

const SecurityBadge = ({ type = 'ssl', size = 'medium', showText = true, className = '' }) => {
  const badges = {
    ssl: {
      icon: FaLock,
      text: 'SSL Secured',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Your data is protected with SSL encryption'
    },
    verified: {
      icon: FaCheckCircle,
      text: 'Verified Business',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Verified and trusted business'
    },
    secure: {
      icon: FaShieldAlt,
      text: 'Secure Platform',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Protected by advanced security measures'
    },
    certified: {
      icon: FaCertificate,
      text: 'PCI Compliant',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'PCI DSS compliant payment processing'
    }
  };

  const sizes = {
    small: {
      iconSize: 'text-sm',
      textSize: 'text-xs',
      padding: 'px-2 py-1',
      iconPadding: 'p-1'
    },
    medium: {
      iconSize: 'text-base',
      textSize: 'text-sm',
      padding: 'px-3 py-2',
      iconPadding: 'p-2'
    },
    large: {
      iconSize: 'text-lg',
      textSize: 'text-base',
      padding: 'px-4 py-3',
      iconPadding: 'p-3'
    }
  };

  const badge = badges[type];
  const sizeConfig = sizes[size];
  const IconComponent = badge.icon;

  if (!showText) {
    return (
      <div 
        className={`inline-flex items-center justify-center rounded-full ${badge.bgColor} ${sizeConfig.iconPadding} ${className}`}
        title={badge.description}
      >
        <IconComponent className={`${badge.color} ${sizeConfig.iconSize}`} />
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center space-x-2 rounded-lg ${badge.bgColor} ${sizeConfig.padding} ${className}`}
      title={badge.description}
    >
      <IconComponent className={`${badge.color} ${sizeConfig.iconSize}`} />
      <span className={`${badge.color} font-medium ${sizeConfig.textSize}`}>
        {badge.text}
      </span>
    </div>
  );
};

const SecurityBadgeGroup = ({ badges = ['ssl', 'verified', 'secure'], size = 'medium', layout = 'horizontal', className = '' }) => {
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 gap-2'
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {badges.map((badgeType, index) => (
        <SecurityBadge 
          key={index}
          type={badgeType} 
          size={size}
          showText={true}
        />
      ))}
    </div>
  );
};

const TrustIndicators = ({ className = '' }) => {
  return (
    <div className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Security & Trust</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <SecurityBadge type="ssl" size="small" />
          <span className="text-xs text-gray-600">256-bit SSL encryption</span>
        </div>
        <div className="flex items-center space-x-3">
          <SecurityBadge type="verified" size="small" />
          <span className="text-xs text-gray-600">Business verified</span>
        </div>
        <div className="flex items-center space-x-3">
          <SecurityBadge type="certified" size="small" />
          <span className="text-xs text-gray-600">PCI DSS compliant</span>
        </div>
        <div className="flex items-center space-x-3">
          <SecurityBadge type="secure" size="small" />
          <span className="text-xs text-gray-600">Advanced security</span>
        </div>
      </div>
    </div>
  );
};

export { SecurityBadge, SecurityBadgeGroup, TrustIndicators };
export default SecurityBadge;