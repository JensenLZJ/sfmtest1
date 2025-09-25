/**
 * Asset Protection for GitHub Pages
 * This script prevents direct access to images and assets
 */

(function() {
    'use strict';
    
    // Check if we're accessing an asset directly
    const currentPath = window.location.pathname;
    const isAsset = /\.(png|jpg|jpeg|gif|svg|ico|css|js|json|woff|woff2|ttf|eot)$/i.test(currentPath);
    const isImageDir = currentPath.startsWith('/images/');
    const isAssetDir = currentPath.startsWith('/assets/');
    
    if (isAsset || isImageDir || isAssetDir) {
        // Check if we have a valid referer (coming from the same site)
        const referer = document.referrer;
        const currentDomain = window.location.hostname;
        const isValidReferer = referer && (
            referer.includes(currentDomain) || 
            referer.includes('samudrafm.com') ||
            referer.includes('samudrafm.github.io')
        );
        
        // If no valid referer, redirect to 404 or home page
        if (!isValidReferer) {
            // Try to redirect to 404 page first, fallback to home
            window.location.href = '/404.html';
            return;
        }
    }
    
    // Additional protection: Hide images if accessed directly
    if (isAsset && !document.referrer) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                font-family: Arial, sans-serif;
                background: #f5f5f5;
                color: #333;
                text-align: center;
            ">
                <div>
                    <h1>Access Denied</h1>
                    <p>This resource is protected and cannot be accessed directly.</p>
                    <a href="/" style="color: #007bff; text-decoration: none;">Go to SamudraFM</a>
                </div>
            </div>
        `;
    }
})();

