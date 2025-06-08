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

    // Updated widget styles
    const styles = `
        #car-repair-widget * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        #car-repair-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 999999;
        }
        
        .crw-toggle-btn {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
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
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6);
            animation: none;
        }
        
        .crw-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            padding: 16px;
            backdrop-filter: blur(8px);
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
            border-radius: 16px;
            width: 100%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            position: relative;
            animation: slideUp 0.3s ease;
        }
        
        @keyframes slideUp {
            from {
                transform: translateY(100px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .crw-header {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            padding: 24px;
            text-align: center;
            border-radius: 16px 16px 0 0;
            position: relative;
        }
        
        .crw-header h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .crw-header p {
            opacity: 0.9;
            font-size: 16px;
        }
        
        .crw-close {
            position: absolute;
            top: 16px;
            right: 16px;
            background: none;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
            opacity: 0.8;
            transition: all 0.2s;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        
        .crw-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.15);
        }
        
        .crw-body {
            padding: 24px;
        }
        
        .crw-form-group {
            margin-bottom: 16px;
        }
        
        .crw-label {
            display: block;
            margin-bottom: 8px;
            color: #1f2937;
            font-weight: 500;
            font-size: 14px;
        }
        
        .crw-select, .crw-input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: all 0.2s;
            background: white;
            font-family: inherit;
        }
        
        .crw-select:focus, .crw-input:focus {
            outline: none;
            border-color: #4f46e5;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }
        
        .crw-checkbox-group {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 12px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 8px;
            border: 2px solid #e5e7eb;
            transition: border-color 0.2s;
        }
        
        .crw-checkbox-group:hover {
            border-color: #4f46e5;
        }
        
        .crw-checkbox {
            width: 20px;
            height: 20px;
            cursor: pointer;
            accent-color: #4f46e5;
        }
        
        .crw-checkbox-group .crw-label {
            margin-bottom: 0;
            cursor: pointer;
            flex: 1;
        }
        
        .crw-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 16px;
            font-family: inherit;
        }
        
        .crw-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
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
            background: #6b7280;
            margin-bottom: 0;
        }
        
        .crw-btn.secondary:hover {
            background: #4b5563;
        }
        
        .crw-result {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            display: none;
            border: 1px solid #e5e7eb;
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
            margin-bottom: 16px;
        }
        
        .crw-cost-breakdown h3 {
            color: #4f46e5;
            margin-bottom: 8px;
            text-align: center;
            font-size: 20px;
            font-weight: 600;
        }
        
        .crw-cost-breakdown p {
            color: #4b5563;
            font-size: 14px;
            text-align: center;
            margin-bottom: 16px;
        }
        
        .crw-cost-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .crw-cost-item:last-child {
            border-bottom: none;
            font-weight: 600;
            font-size: 18px;
            color: #4f46e5;
            margin-top: 12px;
            padding-top: 16px;
            border-top: 2px solid #4f46e5;
        }
        
        .crw-warning {
            background: #fef3c7;
            border: 1px solid #fde68a;
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            font-size: 14px;
            color: #92400e;
            line-height: 1.5;
        }
        
        .crw-lead-form {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
        }
        
        .crw-lead-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .crw-form-row {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        
        .crw-form-row .crw-form-group {
            flex: 1;
            min-width: 200px;
        }
        
        .crw-success-message {
            background: #d1fae5;
            border: 1px solid #6ee7b7;
            color: #065f46;
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            font-weight: 500;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            #car-repair-widget {
                bottom: 16px;
                right: 16px;
            }
            
            .crw-toggle-btn {
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
            
            .crw-modal {
                padding: 12px;
            }
            
            .crw-modal-content {
                max-width: 95vw;
                max-height: 95vh;
                border-radius: 12px;
            }
            
            .crw-body {
                padding: 20px;
            }
            
            .crw-header {
                padding: 20px;
            }
            
            .crw-header h2 {
                font-size: 20px;
            }
            
            .crw-header p {
                font-size: 14px;
            }
            
            .crw-form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .crw-form-row .crw-form-group {
                min-width: 100%;
            }
        }
        
        @media (max-width: 480px) {
            #car-repair-widget {
                bottom: 12px;
                right: 12px;
            }
            
            .crw-toggle-btn {
                width: 45px;
                height: 45px;
                font-size: 18px;
            }
            
            .crw-modal {
                padding: 8px;
            }
            
            .crw-modal-content {
                max-width: 98vw;
            }
            
            .crw-body {
                padding: 16px;
            }
            
            .crw-header {
                padding: 16px;
            }
            
            .crw-header h2 {
                font-size: 18px;
            }
            
            .crw-select, .crw-input {
                font-size: 14px;
                padding: 10px 12px;
            }
            
            .crw-btn {
                font-size: 14px;
                padding: 12px;
            }
        }
    `;

    // Create HTML structure (unchanged)
    const widgetHTML = `
        <div id="car-repair-widget">
            <button class="crw-toggle-btn" id="crw-toggle" title="Get Car Repair Estimate">
                🚗
            </button>
            
            <div class="crw-modal" id="crw-modal">
                <div class="crw-modal-content">
                    <div class="crw-header">
                        <button class="crw-close" id="crw-close" title="Close">×</button>
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

    // Function to calculate repair cost (unchanged)
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

    // Function to format currency (unchanged)
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.round(amount));
    }

    // Function to display cost breakdown (unchanged)
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

    // Lead capture function (unchanged)
    function submitLead(leadData) {
        console.log('Lead captured:', leadData);
        return Promise.resolve();
    }

    // Initialize widget (unchanged)
    function initWidget() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);

        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        const toggle = document.getElementById('crw-toggle');
        const modal = document.getElementById('crw-modal');
        const close = document.getElementById('crw-close');
        const form = document.getElementById('crw-form');
        const result = document.getElementById('crw-result');
        const leadForm = document.getElementById('lead-form');

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
                    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });

        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = leadForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
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
                
                const successDiv = document.createElement('div');
                successDiv.className = 'crw-success-message';
                successDiv.innerHTML = '✅ Thank you! We\'ll contact you soon with a detailed quote.';
                leadForm.appendChild(successDiv);
                
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

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });

        function trackEvent(eventName, data = {}) {
            console.log('Event:', eventName, data);
        }

        toggle.addEventListener('click', () => trackEvent('widget_opened'));
        form.addEventListener('submit', () => trackEvent('estimate_calculated'));
        leadForm.addEventListener('submit', () => trackEvent('lead_submitted'));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();