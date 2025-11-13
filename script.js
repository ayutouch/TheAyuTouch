// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // --- Page Switching Logic ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const logo = document.querySelector('.logo');
    const homeLearnMoreButton = document.getElementById('home-learn-more');
    
    // --- Hamburger Menu ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navList = document.querySelector('.nav-links'); 
    const nav = document.querySelector('nav'); 

    // Toggle menu on hamburger click
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            navList.classList.toggle('nav-open');
            nav.classList.toggle('menu-open');
        });
    }

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
            
            // Close menu on link click
            navList.classList.remove('nav-open');
            nav.classList.remove('menu-open');
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
    // --- End of Page Switching Logic ---

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

    // --- 💸 Price Display Logic ---
    const bookingSelect = document.getElementById('book-service');
    const priceDisplay = document.getElementById('price-notification');

    if (bookingSelect) {
        bookingSelect.addEventListener('change', () => {
            const selectedOption = bookingSelect.options[bookingSelect.selectedIndex];
            const price = selectedOption.getAttribute('data-price');
            if (price) {
                priceDisplay.textContent = 'Estimated Price: ' + price;
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none'; 
            }
        });
    }
    
    // --- 🧠 3D Mouse-Move Tilt Effect (Applied to cards and containers) ---
    const tiltCards = document.querySelectorAll('.service-card, .portfolio-item, #booking .container, #contact .container, #download .container .game-card');
    
    tiltCards.forEach(card => {
        const maxTilt = 15; 

        function handleMouseMove(e) {
            card.style.transition = 'transform 0.05s linear';
            const { width, height, left, top } = card.getBoundingClientRect();
            const x = e.clientX - left; 
            const y = e.clientY - top;  
            const xPct = (x / width) - 0.5; 
            const yPct = (y / height) - 0.5; 
            const rotateY = xPct * maxTilt;
            const rotateX = -1 * yPct * maxTilt;
            const scale = card.classList.contains('service-card') || card.classList.contains('game-card') ? 'scale(1.05)' : 'scale(1.03)';
            card.style.transform = `perspective(1000px) ${scale} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }

        card.addEventListener('mousemove', handleMouseMove);

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s ease-out';
            card.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
        });
        
        card.addEventListener('transitionend', () => {
            if (!card.matches(':hover')) {
                card.style.transition = '';
            }
        });
    });
    
    // --- 📞 Contact Form to WhatsApp ---
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const yourWhatsAppNumber = '919448760729';
            const name = document.getElementById('contact-name').value;
            const email = document.getElementById('contact-email').value;
            const message = document.getElementById('contact-message').value;
            const fullMessage = `Hi! I'm ${name}.\n\nMy email is: ${email}\n\nMessage:\n${message}`;
            const encodedMessage = encodeURIComponent(fullMessage);
            const waURL = `https://wa.me/${yourWhatsAppNumber}?text=${encodedMessage}`;
            window.open(waURL, '_blank');
            contactForm.reset();
        });
    }

    // --- 🚀 Booking Form Submission Logic ---
    const bookingForm = document.getElementById('service-booking-form');
    // NOTE: This URL is placeholder and needs to be your actual Google Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbydR4rJjydo04-wB4jV5tCPX8UvgI7XLhfao2H8PT_SakSYPrfqgLmXlczp-EmQy-le/exec'; 

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            var submitButton = bookingForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            var name = document.getElementById('book-name').value;
            var email = document.getElementById('book-email').value;
            var phone = document.getElementById('book-phone').value;
            var service = document.getElementById('book-service').value;
            var details = document.getElementById('book-message').value;
            var priceText = document.getElementById('price-notification').textContent;
            var price = priceText.replace('Estimated Price: ', '');

            var formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('service', service);
            formData.append('details', details);
            formData.append('price', price);

            fetch(scriptURL, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert('Booking successful! 🎉 Please check your email.');
                    bookingForm.reset();
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
                submitButton.disabled = false;
                submitButton.textContent = 'Book Now';
            });
        });
    }

    // --- ⬇️ Download Animation and Timer Logic ⬇️ ---
    const downloadButtons = document.querySelectorAll('.download-btn');
    const modal = document.getElementById('download-modal');
    const closeBtn = document.querySelector('.close-btn');
    const downloadIcon = document.getElementById('download-icon');
    const modalTitle = document.getElementById('modal-title');
    const progressBar = document.getElementById('progress-bar');
    const timerText = document.getElementById('timer-text');
    const directLink = document.getElementById('direct-link');
    const safeNote = document.getElementById('safe-note');

    const downloadDuration = 5; // seconds

    function openDownloadModal(downloadUrl) {
        // Prevent opening if button is disabled (Coming Soon card)
        if (event.target.classList.contains('disabled-btn')) return;

        let timer = downloadDuration;
        
        // Reset modal state
        modalTitle.textContent = 'Preparing Download...';
        downloadIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        progressBar.style.width = '0%';
        directLink.style.display = 'none';
        timerText.style.display = 'block';
        safeNote.style.display = 'block';
        modal.style.display = 'block';

        const interval = setInterval(() => {
            timer--;

            // Update progress bar
            const progress = (downloadDuration - timer) / downloadDuration * 100;
            progressBar.style.width = `${progress}%`;

            if (timer > 0) {
                timerText.textContent = `Starting in ${timer} seconds...`;
            } else {
                clearInterval(interval);
                
                // Final state: Download ready
                modalTitle.textContent = 'Download Starting! 🎉';
                downloadIcon.innerHTML = '<i class="fas fa-circle-check"></i>';
                progressBar.style.width = '100%';
                timerText.textContent = 'Transfer Complete!';
                safeNote.style.display = 'none';
                
                // Trigger the file download
                const tempLink = document.createElement('a');
                tempLink.href = downloadUrl;
                tempLink.setAttribute('download', ''); 
                tempLink.style.display = 'none';
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                
                // Show manual link as a backup
                directLink.href = downloadUrl;
                directLink.textContent = 'Click to Start Download (Backup)';
                directLink.style.display = 'block';
            }
        }, 1000);

        // Close logic
        closeBtn.onclick = function() {
            clearInterval(interval);
            modal.style.display = 'none';
        }
        window.onclick = function(event) {
            if (event.target == modal) {
                clearInterval(interval);
                modal.style.display = 'none';
            }
        }
    }

    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const gameUrl = e.currentTarget.getAttribute('data-game-url');
            if (gameUrl) {
                openDownloadModal(gameUrl);
            }
        });
    });
    // --- End of Download Logic ---

    // --- 🖼️ CORRECTED: Portfolio Modal Logic ---
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const portfolioModal = document.getElementById('portfolio-modal');
    const fullImage = document.getElementById('full-portfolio-image');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            
            fullImage.src = imgSrc;
            
            // FIX: Use classList to show the modal
            portfolioModal.classList.add('show');
            
            document.body.style.overflow = 'hidden';
        });
    });

    function closePortfolioModal() {
        // FIX: Use classList to hide the modal
        portfolioModal.classList.remove('show');
        document.body.style.overflow = 'auto'; 
    }

    // Close modal when the X is clicked
    modalCloseBtn.addEventListener('click', closePortfolioModal);

    // Close modal when clicking outside the image (on the modal backdrop)
    portfolioModal.addEventListener('click', (event) => {
        if (event.target === portfolioModal) {
            closePortfolioModal();
        }
    });
    // --- End Portfolio Modal Logic ---

    // --- ⌨️ Typing Particle Effect ---
    const formInputs = document.querySelectorAll(
        '.form-group input, .form-group textarea'
    );
    let isTypingThrottled = false;
    const typingColors = [
        'var(--primary-color)',
        'var(--secondary-color)'
    ];

    function createTypingParticle(e) {
        if (isTypingThrottled) return;
        isTypingThrottled = true;
        setTimeout(() => {
            isTypingThrottled = false;
        }, 100);

        const rect = e.target.getBoundingClientRect();
        const spawnX = rect.left + window.scrollX + rect.width - 30;
        const spawnY = rect.top + window.scrollY + (rect.height / 2);

        for (let i = 0; i < 2; i++) {
            const particle = document.createElement('div');
            particle.classList.add('typing-particle');
            particle.style.left = spawnX + (Math.random() * 20 - 10) + 'px';
            particle.style.top = spawnY + (Math.random() * 10 - 5) + 'px';
            const color = typingColors[Math.floor(Math.random() * typingColors.length)];
            particle.style.backgroundColor = color;
            const destinationX = (Math.random() - 0.5) * 60;
            const destinationY = (Math.random() * -50) - 20;
            particle.style.setProperty('--x', destinationX + 'px');
            particle.style.setProperty('--y', destinationY + 'px');
            document.body.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }

    formInputs.forEach(input => {
        input.addEventListener('input', createTypingParticle);
    });
    // --- End of Typing Particle Effect ---

    // --- 💖 Mouse Sparkle Trail ---
    let isMouseThrottled = false; 
    const sparkleColors = [
        'var(--primary-color)',
        'var(--secondary-color)',
        '#FFFFFF'
    ];

    document.addEventListener('mousemove', (e) => {
        if (isMouseThrottled) return; 
        isMouseThrottled = true; 
        setTimeout(() => {
            isMouseThrottled = false; 
        }, 50);

        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = e.clientX + 'px';
        particle.style.top = e.clientY + 'px';
        const color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
        particle.style.backgroundColor = color;
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        const destinationX = (Math.random() - 0.5) * 200;
        const destinationY = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--x', destinationX + 'px');
        particle.style.setProperty('--y', destinationY + 'px');
        document.body.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 800);
    });
    // --- End of Mouse Sparkle Trail ---

});