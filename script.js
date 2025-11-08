// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Switching Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const logo = document.querySelector('.logo');
    const homeLearnMoreButton = document.getElementById('home-learn-more');

    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active-link'));

        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.classList.add('active');

        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (targetLink) targetLink.classList.add('active-link');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });
    
    logo.addEventListener('click', (event) => {
        event.preventDefault();
        showPage('home');
    });

    if (homeLearnMoreButton) {
        homeLearnMoreButton.addEventListener('click', () => {
            showPage('about');
        });
    }

    // --- 💡 Dark Mode Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggle.innerHTML = '🌙';
        }
    }

    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme = 'dark';
        } else {
            currentTheme = 'light';
        }
    }
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        let newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    // --- 💸 NEW: Price Display Logic ---
    const bookingSelect = document.getElementById('book-service');
    const priceDisplay = document.getElementById('price-notification');

    if (bookingSelect) {
        bookingSelect.addEventListener('change', () => {
            // Get the currently selected option element
            const selectedOption = bookingSelect.options[bookingSelect.selectedIndex];
            
            // Get the price from its 'data-price' attribute
            const price = selectedOption.getAttribute('data-price');

            if (price) {
                // If a price exists, update the text and show the div
                priceDisplay.textContent = 'Estimated Price: ' + price;
                priceDisplay.style.display = 'block';
            } else {
                // If they select "-- Select --", hide the div
                priceDisplay.style.display = 'none'; 
            }
        });
    }
    // --- End of Price Display Logic ---

    
    // --- 🧠 NEW: 3D Mouse-Move Tilt Effect ---
    
    // Select all the cards you want to have this effect
    const tiltCards = document.querySelectorAll('.service-card, .portfolio-item, #booking .container, #contact .container');
    
    tiltCards.forEach(card => {
        const maxTilt = 15; // Max tilt in degrees

        function handleMouseMove(e) {
            // On mouse move, we want a FAST transition to follow the cursor
            card.style.transition = 'transform 0.05s linear';
            
            const { width, height, left, top } = card.getBoundingClientRect();
            
            // Get mouse position relative to the card's center
            const x = e.clientX - left; // x position within the element
            const y = e.clientY - top;  // y position within the element
            
            const xPct = (x / width) - 0.5;  // -0.5 to 0.5
            const yPct = (y / height) - 0.5; // -0.5 to 0.5
            
            // Calculate rotation
            // Invert yPct so (top = tilt up)
            const rotateY = xPct * maxTilt;
            const rotateX = -1 * yPct * maxTilt;
            
            // Check class to apply the correct scale (from our previous 3D effect)
            const scale = card.classList.contains('service-card') ? 'scale(1.05)' : 'scale(1.03)';
            
            // Apply the full transform
            card.style.transform = `perspective(1000px) ${scale} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        // Add the listener for when the mouse is moving over the card
        card.addEventListener('mousemove', handleMouseMove);

        // Add the listener for when the mouse leaves the card
        card.addEventListener('mouseleave', () => {
            // On mouse leave, set the SLOW "reset" transition (from your CSS)
            card.style.transition = 'transform 0.4s ease-out';
            
            // Reset the card to its original state
            card.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
        });
        
        // This is a small helper to clean up the transition style
        // so it doesn't stay stuck on "transform 0.4s ease-out"
        card.addEventListener('transitionend', () => {
             // If the card is NOT being hovered, clear the inline transition
            if (!card.matches(':hover')) {
                card.style.transition = '';
            }
        });
    });
    // --- End of 3D Tilt Effect ---

    // --- 📞 NEW: Contact Form to WhatsApp ---
    
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the form from reloading

            // --- ⚠️ IMPORTANT: Add your number ---
            // Replace with your full WhatsApp number including country code
            // (e.g., 911234567890 for India)
            const yourWhatsAppNumber = '919448760729';
            // ---

            // Get form values
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;

            // Create the pre-filled message
            const fullMessage = `Hi! I'm ${name}.\n\nMy email is: ${email}\n\nMessage:\n${message}`;
            
            // URL-encode the message
            const encodedMessage = encodeURIComponent(fullMessage);

            // Build the wa.me link
            const waURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;

            // Open WhatsApp in a new tab
            window.open(waURL, '_blank');
            
            // Reset the form
            contactForm.reset();
        });
    }
    // --- End of Contact Form Logic ---

    // --- 🚀 Form Submission Logic (Updated with Price & Phone) ---
    
    const bookingForm = document.getElementById('service-booking-form');
    // !! IMPORTANT !!
    // This is the URL you provided. Make sure it's your active, deployed script URL.
    const scriptURL = 'https://script.google.com/macros/s/AKfycbydR4rJjydo04-wB4jV5tCPX8UvgI7XLhfao2H8PT_SakSYPrfqgLmXlczp-EmQy-le/exec'; 

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the form from reloading the page
            
            var submitButton = bookingForm.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Disable button
            submitButton.textContent = 'Sending...';

            // Get form data
            var name = document.getElementById('book-name').value;
            var email = document.getElementById('book-email').value;
            var phone = document.getElementById('book-phone').value;
            var service = document.getElementById('book-service').value;
            var details = document.getElementById('book-message').value;
            
            // Get the price text from the notification div
            var priceText = document.getElementById('price-notification').textContent;
            // Clean it up (e.g., "Estimated Price: ₹100 – ₹250" -> "₹100 – ₹250")
            var price = priceText.replace('Estimated Price: ', '');

            // Create a FormData object to send
            var formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('service', service);
            formData.append('details', details);
            formData.append('price', price);

            // Send data to Google Apps Script
            fetch(scriptURL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Booking successful! 🎉 Please check your email.');
                    bookingForm.reset(); // Clear the form
                    // Hide the price notification after reset
                    document.getElementById('price-notification').style.display = 'none'; 
                } else {
                    alert('Error: ' + (data.message || 'Something went wrong.'));
                }
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('An error occurred. Please try again.');
            })
            .finally(() => {
                submitButton.disabled = false; // Re-enable button
                submitButton.textContent = 'Book Now';
            });
        });
    }


    // --- ⌨️ NEW: Typing Particle Effect ---

    // Select all inputs and textareas
    const formInputs = document.querySelectorAll(
        '.form-group input, .form-group textarea'
    );
    
    // A separate throttle flag for typing so it doesn't
    // interfere with the mouse trail
    let isTypingThrottled = false;

    const typingColors = [
        'var(--primary-color)',   /* Lavender */
        'var(--secondary-color)' /* Pink */
    ];

    function createTypingParticle(e) {
        // If we are "throttled", don't do anything
        if (isTypingThrottled) return;
        
        // Otherwise, run the effect and set the throttle
        isTypingThrottled = true;
        
        // Un-throttle after 100 milliseconds
        setTimeout(() => {
            isTypingThrottled = false;
        }, 100);

        // Get the bounding box of the input field
        const rect = e.target.getBoundingClientRect();
        
        // Calculate spawn position (near the right-middle of the input)
        const spawnX = rect.left + window.scrollX + rect.width - 30;
        const spawnY = rect.top + window.scrollY + (rect.height / 2);

        // Create 2 particles
        for (let i = 0; i < 2; i++) {
            const particle = document.createElement('div');
            particle.classList.add('typing-particle'); // Use new CSS class

            // Position it at the calculated spawn point
            particle.style.left = spawnX + (Math.random() * 20 - 10) + 'px'; // Add jitter
            particle.style.top = spawnY + (Math.random() * 10 - 5) + 'px'; // Add jitter

            // Pick a random color
            const color = typingColors[Math.floor(Math.random() * typingColors.length)];
            particle.style.backgroundColor = color;
            
            // Randomize the "burst" destination
            const destinationX = (Math.random() - 0.5) * 60; // -30px to +30px
            const destinationY = (Math.random() * -50) - 20; // -20px to -70px (always up)
            
            // Set the --x and --y custom properties for our CSS animation
            particle.style.setProperty('--x', destinationX + 'px');
            particle.style.setProperty('--y', destinationY + 'px');

            // Add the particle to the page
            document.body.appendChild(particle);

            // Remove the particle from the page after its animation finishes
            setTimeout(() => {
                particle.remove();
            }, 600); // Must match the animation duration
        }
    }

    // Add the 'input' event listener to every form field
    formInputs.forEach(input => {
        input.addEventListener('input', createTypingParticle);
    });
    // --- End of Typing Particle Effect ---


    // --- 💖 NEW: Mouse Sparkle Trail ---

    // We use this to only create a particle every few milliseconds, not on
    // every single pixel of movement. This saves performance.
    let isThrottled = false;
    
    // An array of our cute colors!
    const sparkleColors = [
        'var(--primary-color)',   /* Lavender */
        'var(--secondary-color)', /* Pink */
        '#FFFFFF'                 /* White */
    ];

    document.addEventListener('mousemove', (e) => {
        // If we are "throttled", don't do anything
        if (isThrottled) return;
        
        // Otherwise, run the effect and set the throttle
        isThrottled = true;
        
        // Un-throttle after 50 milliseconds
        setTimeout(() => {
            isThrottled = false;
        }, 50);

        // --- Create the particle ---
        const particle = document.createElement('div');
        particle.classList.add('particle'); // Add our CSS class

        // Position it at the mouse cursor
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';

        // Pick a random color from our array
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        particle.style.backgroundColor = color;
        
        // Randomize the size
        const size = Math.random() * 8 + 4; // 4px to 12px
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Randomize the "sparkle" destination
        const destinationX = (Math.random() - 0.5) * 200; // -100px to +100px
        const destinationY = (Math.random() - 0.5) * 200; // -100px to +100px
        
        // Set the --x and --y custom properties for our CSS animation
        particle.style.setProperty('--x', destinationX + 'px');
        particle.style.setProperty('--y', destinationY + 'px');

        // Add the particle to the page
        document.body.appendChild(particle);

        // Remove the particle from the page after its animation finishes
        setTimeout(() => {
            particle.remove();
        }, 800); // Must match the animation duration
    });
    // --- End of Mouse Sparkle Trail ---

}); // This is the final closing bracket