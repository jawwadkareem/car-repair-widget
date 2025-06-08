// Car Repair Cost Estimation Widget - Standalone Version
(function() {
    'use strict';
    
    // Prevent multiple instances
    if (window.CarRepairWidget) return;
    window.CarRepairWidget = true;

    // Widget data
    const repairData = {
        'rear-bumper': {
            name: 'Rear Bumper Damage',
            parts: { min: 282, max: 565 },
            labor: { min: 377, max: 754 }
        },
        'front-bumper': {
            name: 'Front Bumper Damage',
            parts: { min: 300, max: 600 },
            labor: { min: 400, max: 800 }
        },
        'door-panel': {
            name: 'Door Panel Damage',
            parts: { min: 200, max: 450 },
            labor: { min: 300, max: 600 }
        },
        'headlight': {
            name: 'Headlight Damage',
            parts: { min: 150, max: 400 },
            labor: { min: 100, max: 200 }
        },
        'windscreen': {
            name: 'Windscreen Damage',
            parts: { min: 300, max: 800 },
            labor: { min: 150, max: 300 }
        },
        'side-mirror': {
            name: 'Side Mirror Damage',
            parts: { min: 80, max: 250 },
            labor: { min: 50, max: 150 }
        },
        'underbody-panel': {
            name: 'Underbody Panel Damage',
            parts: { min: 200, max: 400 },
            labor: { min: 250, max: 500 }
        },
        'bonnet': {
            name: 'Bonnet/Hood Damage',
            parts: { min: 400, max: 800 },
            labor: { min: 300, max: 600 }
        }
    };

    const carMakes = [
        'Toyota', 'Holden', 'Ford', 'Mazda', 'Hyundai', 
        'Nissan', 'Volkswagen', 'BMW', 'Mercedes-Benz', 
        'Audi', 'Tesla', 'Lexus', 'Subaru', 'Mitsubishi', 'Other'
    ];

    // Create widget styles
    const styles = `
        #car-repair-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        #car-repair-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            z-index: 999999;
        }
        
        .crw-toggle-btn {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .crw-toggle-btn:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
            animation: none;
        }
        
        .crw-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            padding: 20px;
            backdrop-filter: blur(5px);
        }
        
        .crw-modal.show {
            display: flex;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .crw-modal-content {
            background: white;
            border-radius: 12px;
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            position: relative;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .crw-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 12px 12px 0 0;
            position: relative;
        }
        
        .crw-header h2 {
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .crw-header p {
            opacity: 0.9;
            font-size: 14px;
        }
        
        .crw-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            opacity: 0.8;
            transition: opacity 0.2s;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .crw-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .crw-body {
            padding: 30px;
        }
        
        .crw-form-group {
            margin-bottom: 20px;
        }
        
        .crw-label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }
        
        .crw-select, .crw-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.2s;
            background: white;
            font-family: inherit;
        }
        
        .crw-select:focus, .crw-input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .crw-checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px solid #e9ecef;
            transition: border-color 0.2s;
        }
        
        .crw-checkbox-group:hover {
            border-color: #667eea;
        }
        
        .crw-checkbox {
            width: 18px;
            height: 18px;
            cursor: pointer;
            accent-color: #667eea;
        }
        
        .crw-checkbox-group .crw-label {
            margin-bottom: 0;
            cursor: pointer;
            flex: 1;
        }
        
        .crw-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 15px;
            font-family: inherit;
        }
        
        .crw-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .crw-btn:active {
            transform: translateY(0);
        }
        
        .crw-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .crw-btn.secondary {
            background: #6c757d;
            margin-bottom: 0;
        }
        
        .crw-btn.secondary:hover {
            background: #5a6268;
        }
        
        .crw-result {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
            border: 1px solid #dee2e6;
        }
        
        .crw-result.show {
            display: block;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .crw-cost-breakdown {
            margin-bottom: 15px;
        }
        
        .crw-cost-breakdown h3 {
            color: #667eea;
            margin-bottom: 5px;
            text-align: center;
        }
        
        .crw-cost-breakdown p {
            color: #666;
            font-size: 13px;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .crw-cost-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 8px 0;
            border-bottom: 1px solid #dee2e6;
        }
        
        .crw-cost-item:last-child {
            border-bottom: none;
            font-weight: 600;
            font-size: 16px;
            color: #667eea;
            margin-top: 10px;
            padding-top: 15px;
            border-top: 2px solid #667eea;
        }
        
        .crw-warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 12px;
            border-radius: 6px;
            margin-top: 15px;
            font-size: 13px;
            color: #856404;
            line-height: 1.4;
        }
        
        .crw-lead-form {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
        }
        
        .crw-lead-title {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .crw-form-row {
            display: flex;
            gap: 15px;
        }
        
        .crw-form-row .crw-form-group {
            flex: 1;
        }
        
        .crw-success-message {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 12px;
            border-radius: 6px;
            margin-top: 15px;
            text-align: center;
            font-weight: 500;
        }
        
        @media (max-width: 768px) {
            #car-repair-widget {
                left: 15px;
            }
            
            .crw-toggle-btn {
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
            
            .crw-modal {
                padding: 10px;
            }
            
            .crw-modal-content {
                max-height: 95vh;
            }
            
            .crw-body {
                padding: 20px;
            }
            
            .crw-form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .crw-header {
                padding: 15px;
            }
            
            .crw-header h2 {
                font-size: 18px;
            }
        }
        
        @media (max-width: 480px) {
            .crw-body {
                padding: 15px;
            }
            
            .crw-toggle-btn {
                width: 45px;
                height: 45px;
                font-size: 18px;
            }
        }
    `;

    // Create HTML structure
    const widgetHTML = `
        <div id="car-repair-widget">
            <button class="crw-toggle-btn" id="crw-toggle" title="Get Car Repair Estimate">
                🚗
            </button>
            
            <div class="crw-modal" id="crw-modal">
                <div class="crw-modal-content">
                    <div class="crw-header">
                        <button class="crw-close" id="crw-close" title="Close">&times;</button>
                        <h2>🚗 Car Repair Cost Estimator</h2>
                        <p>Get instant repair cost estimates in AUD</p>
                    </div>
                    
                    <div class="crw-body">
                        <form id="crw-form">
                            <div class="crw-form-row">
                                <div class="crw-form-group">
                                    <label class="crw-label">Car Make</label>
                                    <select class="crw-select" id="carMake" required>
                                        <option value="">Select Make</option>
                                        ${carMakes.map(make => `<option value="${make}">${make}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="crw-form-group">
                                    <label class="crw-label">Year</label>
                                    <select class="crw-select" id="carYear" required>
                                        <option value="">Select Year</option>
                                        ${Array.from({length: 25}, (_, i) => {
                                            const year = 2025 - i;
                                            return `<option value="${year}">${year}</option>`;
                                        }).join('')}
                                    </select>
                                </div>
                            </div>
                            
                            <div class="crw-form-group">
                                <label class="crw-label">Type of Damage</label>
                                <select class="crw-select" id="damageType" required>
                                    <option value="">Select Damage Type</option>
                                    ${Object.entries(repairData).map(([key, data]) => 
                                        `<option value="${key}">${data.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            
                            <div class="crw-checkbox-group">
                                <input type="checkbox" id="luxuryVehicle" class="crw-checkbox">
                                <label for="luxuryVehicle" class="crw-label">Luxury Vehicle (+20% cost)</label>
                            </div>
                            
                            <button type="submit" class="crw-btn" id="calculateBtn">
                                Calculate Repair Cost
                            </button>
                        </form>
                        
                        <div class="crw-result" id="crw-result">
                            <div class="crw-cost-breakdown" id="cost-breakdown"></div>
                            <div class="crw-warning">
                                ⚠️ <strong>Important:</strong> Hidden damage (e.g., suspension, frame) may increase costs. This estimate is approximate - contact a professional for detailed inspection.
                            </div>
                            
                            <div class="crw-lead-form">
                                <div class="crw-lead-title">📞 Get a Detailed Quote</div>
                                <form id="lead-form">
                                    <div class="crw-form-row">
                                        <div class="crw-form-group">
                                            <input type="text" class="crw-input" placeholder="Your Name" id="leadName" required>
                                        </div>
                                        <div class="crw-form-group">
                                            <input type="email" class="crw-input" placeholder="Email Address" id="leadEmail" required>
                                        </div>
                                    </div>
                                    <div class="crw-form-group">
                                        <input type="tel" class="crw-input" placeholder="Phone Number (Optional)" id="leadPhone">
                                    </div>
                                    <button type="submit" class="crw-btn">
                                        Request Detailed Quote
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Function to calculate repair cost
    function calculateCost(damageType, isLuxury) {
        const damage = repairData[damageType];
        if (!damage) return null;

        let partsMin = damage.parts.min;
        let partsMax = damage.parts.max;
        let laborMin = damage.labor.min;
        let laborMax = damage.labor.max;

        if (isLuxury) {
            partsMin *= 1.2;
            partsMax *= 1.2;
            laborMin *= 1.2;
            laborMax *= 1.2;
        }

        const subtotalMin = partsMin + laborMin;
        const subtotalMax = partsMax + laborMax;
        const gstMin = subtotalMin * 0.1;
        const gstMax = subtotalMax * 0.1;
        const totalMin = subtotalMin + gstMin;
        const totalMax = subtotalMax + gstMax;

        return {
            parts: { min: partsMin, max: partsMax },
            labor: { min: laborMin, max: laborMax },
            subtotal: { min: subtotalMin, max: subtotalMax },
            gst: { min: gstMin, max: gstMax },
            total: { min: totalMin, max: totalMax }
        };
    }

    // Function to format currency
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    }

    // Function to display cost breakdown
    function displayCostBreakdown(costs, damageType) {
        const breakdown = document.getElementById('cost-breakdown');
        const damageName = repairData[damageType].name;
        
        breakdown.innerHTML = `
            <h3>${damageName}</h3>
            <p>Cost breakdown for Australian market</p>
            <div class="crw-cost-item">
                <span>Parts Cost:</span>
                <span>${formatCurrency(costs.parts.min)} - ${formatCurrency(costs.parts.max)}</span>
            </div>
            <div class="crw-cost-item">
                <span>Labor Cost:</span>
                <span>${formatCurrency(costs.labor.min)} - ${formatCurrency(costs.labor.max)}</span>
            </div>
            <div class="crw-cost-item">
                <span>GST (10%):</span>
                <span>${formatCurrency(costs.gst.min)} - ${formatCurrency(costs.gst.max)}</span>
            </div>
            <div class="crw-cost-item">
                <span><strong>Total Estimate:</strong></span>
                <span><strong>${formatCurrency(costs.total.min)} - ${formatCurrency(costs.total.max)}</strong></span>
            </div>
        `;
    }

    // Lead capture function (customize this for your backend)
    function submitLead(leadData) {
        // This is where you would send the lead data to your server
        // For now, we'll just log it and show a success message
        console.log('Lead captured:', leadData);
        
        // You can replace this with your actual API call
        // Example:
        // fetch('/api/leads', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(leadData)
        // });
        
        return Promise.resolve();
    }

    // Initialize widget
    function initWidget() {
        // Add styles
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        // Add HTML
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Get elements
        const toggle = document.getElementById('crw-toggle');
        const modal = document.getElementById('crw-modal');
        const close = document.getElementById('crw-close');
        const form = document.getElementById('crw-form');
        const result = document.getElementById('crw-result');
        const leadForm = document.getElementById('lead-form');

        // Event listeners
        toggle.addEventListener('click', () => {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        close.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        function closeModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const damageType = document.getElementById('damageType').value;
            const isLuxury = document.getElementById('luxuryVehicle').checked;
            const carMake = document.getElementById('carMake').value;
            const carYear = document.getElementById('carYear').value;
            
            if (damageType && carMake && carYear) {
                const costs = calculateCost(damageType, isLuxury);
                if (costs) {
                    displayCostBreakdown(costs, damageType);
                    result.classList.add('show');
                    
                    // Scroll to result
                    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });

        // Lead form submission
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            try {
                const leadData = {
                    name: document.getElementById('leadName').value,
                    email: document.getElementById('leadEmail').value,
                    phone: document.getElementById('leadPhone').value,
                    carMake: document.getElementById('carMake').value,
                    carYear: document.getElementById('carYear').value,
                    damageType: document.getElementById('damageType').value,
                    isLuxury: document.getElementById('luxuryVehicle').checked,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                };
                
                await submitLead(leadData);
                
                // Show success message
                const successDiv = document.createElement('div');
                successDiv.className = 'crw-success-message';
                successDiv.innerHTML = '✅ Thank you! We\'ll contact you soon with a detailed quote.';
                leadForm.appendChild(successDiv);
                
                // Reset forms after delay
                setTimeout(() => {
                    form.reset();
                    leadForm.reset();
                    result.classList.remove('show');
                    closeModal();
                }, 2000);
                
            } catch (error) {
                console.error('Error submitting lead:', error);
                alert('Sorry, there was an error submitting your request. Please try again.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        // Add some analytics tracking (optional)
        function trackEvent(eventName, data = {}) {
            // You can integrate with Google Analytics, Facebook Pixel, etc.
            console.log('Event:', eventName, data);
            
            // Example Google Analytics 4 tracking:
            // if (typeof gtag !== 'undefined') {
            //     gtag('event', eventName, data);
            // }
        }

        // Track widget interactions
        toggle.addEventListener('click', () => trackEvent('widget_opened'));
        form.addEventListener('submit', () => trackEvent('estimate_calculated'));
        leadForm.addEventListener('submit', () => trackEvent('lead_submitted'));
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();