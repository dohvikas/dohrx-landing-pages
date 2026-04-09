// Debug script to check GTM and GA4 events
// Add this to your page temporarily to debug

// Check if dataLayer exists
console.log('DataLayer exists:', typeof dataLayer !== 'undefined');
console.log('Current dataLayer:', dataLayer);

// Monitor dataLayer pushes
const originalPush = dataLayer.push;
dataLayer.push = function() {
    console.log('DataLayer push:', arguments[0]);
    return originalPush.apply(dataLayer, arguments);
};

// Check GA4 configuration
if (typeof gtag !== 'undefined') {
    console.log('GA4 gtag function exists');
    
    // Override gtag to log all calls
    const originalGtag = gtag;
    gtag = function() {
        console.log('GA4 gtag call:', arguments);
        return originalGtag.apply(this, arguments);
    };
} else {
    console.log('GA4 gtag function NOT found');
}

// Check GTM container
if (typeof google_tag_manager !== 'undefined') {
    console.log('GTM loaded successfully');
} else {
    console.log('GTM not loaded');
}

// Add click listeners to all buttons to verify events
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('a[onclick*="dataLayer.push"], button[onclick*="dataLayer.push"]');
    console.log('Found buttons with tracking:', buttons.length);
    
    buttons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            console.log(`Button ${index + 1} clicked:`, this.getAttribute('onclick'));
        });
    });
});
