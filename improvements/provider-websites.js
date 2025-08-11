// ========================================
// PROVIDER WEBSITES FOR SANTA MONICA HEALTH NAVIGATOR
// Adds website links to recommended care providers
// ========================================

/**
 * PROBLEM SOLVED:
 * - Before: Recommendations show providers but no website links
 * - After: Each provider has a "Visit Website" button with direct link
 */

(function() {
    'use strict';
    
    console.log('🚀 Loading Provider Websites...');
    
    // ========================================
    // PROVIDER WEBSITES DATABASE
    // ========================================
    
    const PROVIDER_WEBSITES = {
        // Santa Monica Area Hospitals
        "Santa Monica Hospital": "https://www.providence.org/locations/ca/santa-monica-hospital",
        "UCLA Medical Center": "https://www.uclahealth.org/medical-center",
        "Cedars-Sinai": "https://www.cedars-sinai.org",
        "Providence Saint John's": "https://www.providence.org/locations/ca/saint-johns",
        "Saint John's Health Center": "https://www.providence.org/locations/ca/saint-johns",
        
        // Urgent Care Centers
        "UCLA Urgent Care": "https://www.uclahealth.org/urgent-care",
        "Kaiser Permanente Urgent Care": "https://healthy.kaiserpermanente.org/care-near-you/urgent-care",
        "Cedars-Sinai Urgent Care": "https://www.cedars-sinai.org/programs/urgent-care",
        "Providence Urgent Care": "https://www.providence.org/services/urgent-care",
        
        // Primary Care
        "Santa Monica Family Medicine": "https://www.santamonicafamilymedicine.com",
        "UCLA Primary Care": "https://www.uclahealth.org/primary-care",
        "Providence Primary Care": "https://www.providence.org/services/primary-care",
        
        // Specialists
        "Santa Monica Orthopedic Group": "https://www.smog.md",
        "UCLA Neurology": "https://www.uclahealth.org/neurology",
        "Cedars-Sinai Cardiology": "https://www.cedars-sinai.org/programs/cardiology",
        "UCLA Cardiology": "https://www.uclahealth.org/cardiology",
        "Providence Neurology": "https://www.providence.org/services/neurology",
        
        // Emergency Departments
        "Santa Monica Hospital Emergency": "https://www.providence.org/locations/ca/santa-monica-hospital/emergency-services",
        "UCLA Emergency Department": "https://www.uclahealth.org/emergency",
        "Cedars-Sinai Emergency": "https://www.cedars-sinai.org/programs/emergency-medicine",
        
        // Telehealth Options
        "UCLA Telehealth": "https://www.uclahealth.org/telehealth",
        "Kaiser Telehealth": "https://healthy.kaiserpermanente.org/care-near-you/telehealth",
        "Providence Virtual Care": "https://www.providence.org/services/virtual-care"
    };

    // ========================================
    // PROVIDER WEBSITE FUNCTIONS
    // ========================================
    
    /**
     * Add website links to provider cards/recommendations
     */
    function addProviderWebsites() {
        console.log('🔍 Looking for provider cards to add website links...');
        
        // Find provider cards/listings
        const providerCards = document.querySelectorAll('.provider-card, .recommendation-card, .care-option, .provider-item');
        
        providerCards.forEach(card => {
            const providerName = card.querySelector('h3, h4, .provider-name, .facility-name')?.textContent?.trim();
            
            if (providerName && PROVIDER_WEBSITES[providerName]) {
                // Check if website link already exists
                if (!card.querySelector('.website-link')) {
                    const websiteLink = document.createElement('a');
                    websiteLink.href = PROVIDER_WEBSITES[providerName];
                    websiteLink.target = '_blank';
                    websiteLink.className = 'website-link';
                    websiteLink.innerHTML = `
                        <div style="background: #0ea5e9; color: white; padding: 8px 16px; border-radius: 6px; text-align: center; margin-top: 12px; text-decoration: none; display: inline-block; cursor: pointer;">
                            🌐 Visit Website
                        </div>
                    `;
                    websiteLink.style.textDecoration = 'none';
                    
                    card.appendChild(websiteLink);
                    console.log('✅ Added website link for:', providerName);
                }
            }
        });
        
        // Also look for provider names in text content
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent?.trim();
            if (text && PROVIDER_WEBSITES[text] && !element.querySelector('.website-link')) {
                // Check if this looks like a provider listing
                if (element.closest('.provider-card, .recommendation-card, .care-option') ||
                    element.tagName === 'H3' || element.tagName === 'H4') {
                    
                    const websiteLink = document.createElement('a');
                    websiteLink.href = PROVIDER_WEBSITES[text];
                    websiteLink.target = '_blank';
                    websiteLink.className = 'website-link';
                    websiteLink.innerHTML = `
                        <span style="background: #0ea5e9; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px; text-decoration: none;">
                            🌐 Website
                        </span>
                    `;
                    websiteLink.style.textDecoration = 'none';
                    
                    element.appendChild(websiteLink);
                    console.log('✅ Added inline website link for:', text);
                }
            }
        });
    }

    /**
     * Add website links with fuzzy matching for partial provider names
     */
    function addProviderWebsitesWithFuzzyMatching() {
        console.log('🔍 Looking for providers with fuzzy matching...');
        
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            const text = element.textContent?.trim();
            if (text && text.length > 5) {
                // Check for partial matches
                Object.keys(PROVIDER_WEBSITES).forEach(providerName => {
                    if (text.includes(providerName) || providerName.includes(text)) {
                        if (!element.querySelector('.website-link')) {
                            const websiteLink = document.createElement('a');
                            websiteLink.href = PROVIDER_WEBSITES[providerName];
                            websiteLink.target = '_blank';
                            websiteLink.className = 'website-link';
                            websiteLink.innerHTML = `
                                <span style="background: #0ea5e9; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-left: 8px; text-decoration: none;">
                                    🌐 Website
                                </span>
                            `;
                            websiteLink.style.textDecoration = 'none';
                            
                            element.appendChild(websiteLink);
                            console.log('✅ Added fuzzy-matched website link for:', providerName);
                        }
                    }
                });
            }
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    /**
     * Initialize Provider Websites
     */
    function initializeProviderWebsites() {
        // Apply website links if on recommendations page
        if (window.location.href.includes('recommendations') || 
            document.querySelector('.provider-card, .recommendation-card, .care-option') ||
            document.querySelector('*').textContent.includes('Recommendations')) {
            
            setTimeout(() => {
                addProviderWebsites();
                addProviderWebsitesWithFuzzyMatching();
            }, 1000);
        }
        
        // Also monitor for dynamic content loading
        const observer = new MutationObserver(() => {
            addProviderWebsites();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Store in window for external access
        window.PROVIDER_WEBSITES_SYSTEM = {
            addWebsites: addProviderWebsites,
            addWebsitesWithFuzzyMatching: addProviderWebsitesWithFuzzyMatching,
            websiteDatabase: PROVIDER_WEBSITES
        };
        
        console.log('🎉 PROVIDER WEBSITES SYSTEM INITIALIZED!');
        console.log('✅ Website links will be added to provider recommendations');
        console.log('✅ Monitoring for dynamic content');
    }

    // ========================================
    // AUTO-INITIALIZE
    // ========================================
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProviderWebsites);
    } else {
        initializeProviderWebsites();
    }
    
})();

// ========================================
// USAGE INSTRUCTIONS
// ========================================

/**
 * HOW TO USE:
 * 
 * 1. Include this file in your HTML:
 *    <script src="improvements/provider-websites.js"></script>
 * 
 * 2. The system will automatically:
 *    - Add website links to provider recommendations
 *    - Monitor for dynamically loaded content
 *    - Work with existing provider listing UI
 * 
 * 3. Expected behavior:
 *    - Provider cards show "Visit Website" buttons
 *    - Links open in new tabs
 *    - Works with major Santa Monica area providers
 * 
 * 4. For manual control:
 *    - Access window.PROVIDER_WEBSITES_SYSTEM.addWebsites()
 */
