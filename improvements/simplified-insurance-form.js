// ========================================
// SIMPLIFIED INSURANCE FORM FOR SANTA MONICA HEALTH NAVIGATOR
// Makes insurance section more user-friendly
// Removes complex fields and adds helpful guidance
// ========================================

/**
 * PROBLEM SOLVED:
 * - Before: Complex insurance form with Member ID, Copay Amount, Deductible questions
 * - After: Simple 2-3 question form with helpful guidance
 */

(function() {
    'use strict';
    
    console.log('🚀 Loading Simplified Insurance Form...');
    
    // ========================================
    // SIMPLIFIED INSURANCE FORM STRUCTURE
    // ========================================
    
    const SIMPLIFIED_INSURANCE_FORM = {
        // Main question - keep simple
        hasInsurance: {
            question: "Do you have health insurance?",
            options: ["Yes, I have insurance", "No insurance", "Not sure"]
        },
        
        // Simplified insurance provider list (major ones only)
        insuranceProvider: {
            question: "Who is your insurance company?",
            options: [
                "Blue Cross Blue Shield",
                "Kaiser Permanente", 
                "Aetna",
                "Cigna",
                "UnitedHealthcare",
                "Medicare",
                "Medicaid",
                "Other",
                "Don't know"
            ]
        },
        
        // Simplified plan type
        planType: {
            question: "What type of plan do you have?",
            options: [
                "HMO (Health Maintenance Organization)",
                "PPO (Preferred Provider Organization)", 
                "EPO (Exclusive Provider Organization)",
                "Other",
                "Don't know"
            ],
            helpText: "Don't worry if you're not sure - we'll help you find care either way!"
        }
    };

    // ========================================
    // FORM SIMPLIFICATION FUNCTIONS
    // ========================================
    
    /**
     * Hide complex insurance fields that confuse users
     */
    function hideComplexInsuranceFields() {
        console.log('🔍 Looking for complex fields to hide...');
        
        // Find and hide Member ID field
        const memberIdLabel = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.includes('Member ID (Optional)')
        );
        if (memberIdLabel) {
            const memberIdContainer = memberIdLabel.closest('div');
            if (memberIdContainer) {
                memberIdContainer.style.display = 'none';
                console.log('✅ Hidden: Member ID field');
            }
        }
        
        // Find and hide Preferred Healthcare Network field
        const networkLabel = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.includes('Preferred Healthcare Network (Optional)')
        );
        if (networkLabel) {
            const networkContainer = networkLabel.closest('div');
            if (networkContainer) {
                networkContainer.style.display = 'none';
                console.log('✅ Hidden: Healthcare Network field');
            }
        }
        
        // Find and hide Typical Copay Amount field
        const copayLabel = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.includes('Typical Copay Amount (Optional)')
        );
        if (copayLabel) {
            const copayContainer = copayLabel.closest('div');
            if (copayContainer) {
                copayContainer.style.display = 'none';
                console.log('✅ Hidden: Copay Amount field');
            }
        }
        
        // Find and hide Deductible question
        const deductibleLabel = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent && el.textContent.includes('Have you met your deductible this year?')
        );
        if (deductibleLabel) {
            const deductibleContainer = deductibleLabel.closest('div');
            if (deductibleContainer) {
                deductibleContainer.style.display = 'none';
                console.log('✅ Hidden: Deductible question');
            }
        }
    }

    /**
     * Add helpful guidance text to insurance form
     */
    function addHelpfulGuidanceText() {
        // Find insurance form container
        const insuranceForm = document.querySelector('.insurance-form, form, [class*="insurance"]') || 
                             document.querySelector('h2, h3').closest('div');
        
        if (insuranceForm) {
            const helpText = document.createElement('div');
            helpText.innerHTML = `
                <div style="background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 16px; margin: 16px 0;">
                    <h4 style="color: #0369a1; margin: 0 0 8px 0;">💡 Simplified Insurance Form</h4>
                    <p style="color: #0369a1; margin: 0; font-size: 14px;">
                        We've simplified this form! Just tell us if you have insurance and which company. 
                        We'll help you find care options regardless of your insurance details.
                    </p>
                </div>
            `;
            
            // Insert at the top of the form
            const firstChild = insuranceForm.firstElementChild;
            if (firstChild) {
                insuranceForm.insertBefore(helpText, firstChild);
                console.log('✅ Added: Helpful guidance text');
            }
        }
    }

    /**
     * Simplify insurance form by hiding complex fields and adding guidance
     */
    function simplifyInsuranceForm() {
        hideComplexInsuranceFields();
        addHelpfulGuidanceText();
        console.log('🎉 Insurance form simplification complete!');
    }

    // ========================================
    // INITIALIZATION
    // ========================================
    
    /**
     * Initialize the Simplified Insurance Form
     */
    function initializeSimplifiedInsuranceForm() {
        // Apply simplifications if on insurance page
        if (window.location.href.includes('insurance') || 
            document.querySelector('[class*="insurance"]') ||
            document.querySelector('*').textContent.includes('Insurance Information')) {
            
            setTimeout(() => {
                simplifyInsuranceForm();
            }, 500);
        }
        
        // Store in window for external access
        window.SIMPLIFIED_INSURANCE_FORM = {
            simplifyForm: simplifyInsuranceForm,
            hideComplexFields: hideComplexInsuranceFields,
            addGuidanceText: addHelpfulGuidanceText
        };
        
        console.log('🎉 SIMPLIFIED INSURANCE FORM INITIALIZED!');
        console.log('✅ Complex fields will be hidden');
        console.log('✅ Helpful guidance added');
    }

    // ========================================
    // AUTO-INITIALIZE
    // ========================================
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSimplifiedInsuranceForm);
    } else {
        initializeSimplifiedInsuranceForm();
    }
    
})();

// ========================================
// USAGE INSTRUCTIONS
// ========================================

/**
 * HOW TO USE:
 * 
 * 1. Include this file in your HTML:
 *    <script src="improvements/simplified-insurance-form.js"></script>
 * 
 * 2. The system will automatically:
 *    - Hide complex insurance fields (Member ID, Copay, Deductible)
 *    - Add helpful guidance text
 *    - Make the form more user-friendly
 * 
 * 3. Expected behavior:
 *    - Insurance form shows only essential questions
 *    - Users see helpful guidance text
 *    - Less intimidating and more accessible
 * 
 * 4. For manual control:
 *    - Access window.SIMPLIFIED_INSURANCE_FORM.simplifyForm()
 */
