// ========================================
// SMART CATEGORY SYSTEM FOR SANTA MONICA HEALTH NAVIGATOR
// Fixes "Gynecological for headache" issue
// Auto-selects correct categories based on symptoms and body parts
// ========================================

/**
 * PROBLEM SOLVED:
 * - Before: User selects "Head" + "Headache" → Category shows "General" and dropdown includes "Gynecological"
 * - After: User selects "Head" + "Headache" → Category auto-selects "Neurological" and hides irrelevant options
 */

(function() {
    'use strict';
    
    console.log('🚀 Loading Smart Category System...');
    
    // ========================================
    // SMART CATEGORY MAPPING DATABASE
    // Maps symptoms to their most appropriate medical specialties
    // ========================================
    
    const SMART_CATEGORY_MAP = {
        // HEAD & NEUROLOGICAL SYMPTOMS
        'Headache': 'Neurological',
        'Migraine': 'Neurological',
        'Tension headache': 'Neurological',
        'Cluster headache': 'Neurological',
        'Dizziness': 'Neurological',
        'Vertigo': 'Neurological',
        'Memory problems': 'Neurological',
        'Confusion': 'Neurological',
        'Seizure': 'Neurological',
        'Fainting': 'Neurological',
        'Loss of consciousness': 'Neurological',
        
        // HEAD & ENT SYMPTOMS
        'Sinus headache': 'ENT (Ear, Nose, Throat)',
        'Ear pain': 'ENT (Ear, Nose, Throat)',
        'Hearing loss': 'ENT (Ear, Nose, Throat)',
        'Tinnitus': 'ENT (Ear, Nose, Throat)',
        'Ear discharge': 'ENT (Ear, Nose, Throat)',
        'Sinus pressure': 'ENT (Ear, Nose, Throat)',
        'Nasal congestion': 'ENT (Ear, Nose, Throat)',
        
        // HEAD & OPHTHALMOLOGICAL SYMPTOMS
        'Eye pain': 'Ophthalmological',
        'Blurred vision': 'Ophthalmological',
        'Double vision': 'Ophthalmological',
        'Light sensitivity': 'Ophthalmological',
        'Eye discharge': 'Ophthalmological',
        'Red eyes': 'Ophthalmological',
        
        // CHEST SYMPTOMS
        'Chest pain': 'Cardiovascular',
        'Heart palpitations': 'Cardiovascular',
        'Shortness of breath': 'Respiratory',
        'Cough': 'Respiratory',
        'Wheezing': 'Respiratory',
        
        // ABDOMEN SYMPTOMS
        'Nausea': 'Gastrointestinal',
        'Vomiting': 'Gastrointestinal',
        'Stomach pain': 'Gastrointestinal',
        'Diarrhea': 'Gastrointestinal',
        
        // SKIN SYMPTOMS
        'Rash': 'Dermatological',
        'Itching': 'Dermatological',
        'Skin discoloration': 'Dermatological',
        'Bruising': 'Dermatological',
        'Swelling': 'Dermatological',
        'Hives': 'Dermatological',
        'Dry skin': 'Dermatological',
        'Skin lesions': 'Dermatological',
        
        // GENERAL SYMPTOMS (but still filter by body part)
        'Fever': 'General',
        'Chills': 'General',
        'Fatigue': 'General',
        'Weakness': 'General',
        'Weight loss': 'General',
        'Weight gain': 'General',
        'Night sweats': 'General',
        'Loss of appetite': 'General'
    };

    // ========================================
    // BODY PART TO ALLOWED CATEGORIES FILTER
    // Filters dropdown options based on selected body part
    // ========================================
    
    const BODY_PART_CATEGORIES = {
        'head': ['Neurological', 'ENT (Ear, Nose, Throat)', 'Ophthalmological', 'General'],
        'chest': ['Cardiovascular', 'Respiratory', 'General'],
        'abdomen': ['Gastrointestinal', 'Urological', 'General'],
        'pelvis': ['Gynecological', 'Urological', 'General'],
        'back': ['Musculoskeletal', 'Neurological', 'General'],
        'arms': ['Musculoskeletal', 'Cardiovascular', 'Neurological', 'General'],
        'legs': ['Musculoskeletal', 'Cardiovascular', 'Neurological', 'General'],
        'skin': ['Dermatological', 'General']
    };

    // ========================================
    // CORE FUNCTIONS
    // ========================================
    
    /**
     * Get selected body part from the UI
     * @returns {string} Selected body part or 'head' as default
     */
    function getSelectedBodyPart() {
        // Check for selected areas in the UI
        const selectedAreas = document.querySelector('.selected-areas, [class*="selected"]');
        if (selectedAreas) {
            const text = selectedAreas.textContent.toLowerCase();
            if (text.includes('head')) return 'head';
            if (text.includes('chest')) return 'chest';
            if (text.includes('abdomen')) return 'abdomen';
            if (text.includes('pelvis')) return 'pelvis';
            if (text.includes('back')) return 'back';
        }
        
        // Check URL or other indicators
        const url = window.location.href;
        if (url.includes('head') || url.includes('Step 2')) {
            return 'head'; // Default to head for symptom selection
        }
        
        return 'head'; // Default fallback
    }

    /**
     * Smart Category Selection Function
     * Auto-selects the most appropriate category for a symptom
     * @param {string} symptomName - Name of the selected symptom
     * @param {string} bodyPart - Selected body part
     */
    function handleSmartSymptomSelection(symptomName, bodyPart) {
        console.log('🎯 Smart selection for:', symptomName, 'on', bodyPart);
        
        // Auto-select correct category
        const smartCategory = SMART_CATEGORY_MAP[symptomName];
        if (smartCategory) {
            setTimeout(() => {
                const categorySelect = document.querySelector('select[name*="category"], .category-select select, select');
                if (categorySelect && categorySelect.value !== smartCategory) {
                    categorySelect.value = smartCategory;
                    categorySelect.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('✅ AUTO-SELECTED:', smartCategory, 'for', symptomName);
                }
            }, 200);
        }
        
        // Filter dropdown options based on body part
        setTimeout(() => {
            filterCategoryOptions(bodyPart);
        }, 300);
    }

    /**
     * Filter Category Options Based on Body Part
     * Hides irrelevant categories (like "Gynecological" for head symptoms)
     * @param {string} bodyPart - Selected body part
     */
    function filterCategoryOptions(bodyPart) {
        const allowedCategories = BODY_PART_CATEGORIES[bodyPart] || ['General'];
        const categorySelect = document.querySelector('select[name*="category"], .category-select select, select');
        
        if (categorySelect) {
            const options = categorySelect.querySelectorAll('option');
            let hiddenCount = 0;
            
            options.forEach(option => {
                if (option.value === '' || allowedCategories.includes(option.value)) {
                    option.style.display = 'block';
                } else {
                    option.style.display = 'none';
                    if (option.value === 'Gynecological') {
                        console.log('🚫 HIDDEN: Gynecological (not relevant for', bodyPart, ')');
                    }
                    hiddenCount++;
                }
            });
            
            console.log('✅ Category filtering complete - Hidden:', hiddenCount, 'irrelevant options');
        }
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    /**
     * Add Event Listeners for Symptom Clicks and Category Filtering
     */
    function addSmartEventListeners() {
        // Handle symptom clicks
        document.addEventListener('click', function(event) {
            const symptomName = event.target.textContent?.trim();
            if (symptomName && SMART_CATEGORY_MAP[symptomName]) {
                const selectedBodyPart = getSelectedBodyPart();
                console.log('🖱️ Smart symptom clicked:', symptomName);
                handleSmartSymptomSelection(symptomName, selectedBodyPart);
            }
        });
        
        // Handle dropdown clicks to apply filtering
        document.addEventListener('click', function(event) {
            if (event.target.matches('select')) {
                setTimeout(() => {
                    const selectedBodyPart = getSelectedBodyPart();
                    filterCategoryOptions(selectedBodyPart);
                }, 100);
            }
        });
        
        // Handle page navigation to reapply filtering
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                const selectedBodyPart = getSelectedBodyPart();
                filterCategoryOptions(selectedBodyPart);
            }, 500);
        });
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    /**
     * Initialize the Smart Category System
     */
    function initializeSmartCategorySystem() {
        // Add event listeners
        addSmartEventListeners();
        
        // Apply initial filtering if on symptom page
        if (document.querySelector('select[name*="category"], .category-select select, select')) {
            const currentBodyPart = getSelectedBodyPart();
            filterCategoryOptions(currentBodyPart);
        }
        
        // Store in window for debugging and external access
        window.SMART_HEALTH_NAVIGATOR = {
            categoryMap: SMART_CATEGORY_MAP,
            bodyPartCategories: BODY_PART_CATEGORIES,
            filterCategories: filterCategoryOptions,
            handleSymptomSelection: handleSmartSymptomSelection,
            getSelectedBodyPart: getSelectedBodyPart
        };
        
        console.log('🎉 SMART CATEGORY SYSTEM INITIALIZED!');
        console.log('✅ No more "Gynecological for headache"!');
        console.log('✅ Auto-category selection active');
        console.log('✅ Body part filtering active');
    }

    // ========================================
    // AUTO-INITIALIZE
    // ========================================
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSmartCategorySystem);
    } else {
        initializeSmartCategorySystem();
    }
    
})();

// ========================================
// USAGE INSTRUCTIONS
// ========================================

/**
 * HOW TO USE:
 * 
 * 1. Include this file in your HTML:
 *    <script src="improvements/smart-category-system.js"></script>
 * 
 * 2. The system will automatically:
 *    - Auto-select appropriate categories for symptoms
 *    - Hide irrelevant categories based on body part
 *    - Work with existing symptom selection UI
 * 
 * 3. Expected behavior:
 *    - Head + Headache → Auto-selects "Neurological"
 *    - Head symptoms → Hides "Gynecological" from dropdown
 *    - Only shows relevant categories for each body part
 * 
 * 4. For debugging:
 *    - Check browser console for logs
 *    - Access window.SMART_HEALTH_NAVIGATOR for manual testing
 */
