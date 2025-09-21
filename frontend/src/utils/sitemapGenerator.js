// Sitemap Generator for Universal Wallpaper
// This can be integrated into your build process or run as a standalone script

const fs = require('fs');
const path = require('path');

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'monthly' },
  { url: '/contact', priority: '0.8', changefreq: 'monthly' },
  { url: '/help', priority: '0.7', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.5', changefreq: 'yearly' },
  { url: '/terms-of-service', priority: '0.5', changefreq: 'yearly' },
  { url: '/shipping-policy', priority: '0.6', changefreq: 'monthly' },
  { url: '/return-policy', priority: '0.6', changefreq: 'monthly' },
  { url: '/become-seller', priority: '0.7', changefreq: 'monthly' },
  { url: '/categories', priority: '0.9', changefreq: 'weekly' },
  { url: '/products', priority: '0.9', changefreq: 'daily' }
];

// Product categories (you can fetch these from your database)
const categories = [
  'wallpaper', 'paints', 'home-decor', 'wall-panels', 'furniture',
  'lighting', 'flooring', 'window-treatments', 'outdoor-decor'
];

function generateSitemap() {
  const baseUrl = 'https://universalwallpaper.com';
  const currentDate = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add category pages
  categories.forEach(category => {
    sitemap += `  <url>
    <loc>${baseUrl}/category/${category}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  });

  sitemap += `</urlset>`;

  // Write sitemap to public folder
  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap.xml'),
    sitemap,
    'utf8'
  );

  console.log('✅ Sitemap generated successfully!');
}

// Generate product-specific sitemap (this would typically fetch from database)
function generateProductSitemap() {
  const baseUrl = 'https://universalwallpaper.com';
  const currentDate = new Date().toISOString();
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // This would typically be fetched from your database
  // For now, we'll create a template structure
  sitemap += `  <!-- Product URLs will be generated dynamically from database -->
  <!-- Example product URL structure:
  <url>
    <loc>${baseUrl}/product/product-slug</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <image:image>
      <image:loc>${baseUrl}/images/products/product-image.jpg</image:loc>
      <image:title>Product Title</image:title>
      <image:caption>Product Description</image:caption>
    </image:image>
  </url>
  -->
`;

  sitemap += `</urlset>`;

  fs.writeFileSync(
    path.join(__dirname, '../public/sitemap-products.xml'),
    sitemap,
    'utf8'
  );

  console.log('✅ Product sitemap template generated!');
}

if (require.main === module) {
  generateSitemap();
  generateProductSitemap();
}

module.exports = { generateSitemap, generateProductSitemap };