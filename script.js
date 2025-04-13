document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 800, // Animation duration in ms (e.g., 800)
        once: true, // Whether animation should happen only once - while scrolling down
        offset: 50, // Offset (in px) from the original trigger point (e.g., 50)
        easing: 'ease-in-out', // Default easing for AOS animations
    });

    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.getElementById('header'); // Get header for calculating offset

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // Optional: Change hamburger icon to 'X' when active
            menuToggle.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.textContent = '☰'; // Change icon back
                }
            });
        });

        // Close menu if clicked outside the menu on mobile
         document.addEventListener('click', (event) => {
             const isClickInsideNav = navLinks.contains(event.target);
             const isClickOnToggle = menuToggle.contains(event.target);

             if (!isClickInsideNav && !isClickOnToggle && navLinks.classList.contains('active')) {
                 navLinks.classList.remove('active');
                 menuToggle.textContent = '☰';
             }
         });
    }


    // Active Navigation Link Highlighting on Scroll (Scrollspy)
    const sections = document.querySelectorAll('main section[id]'); // Get all main sections with an ID
    const navLiAnchors = document.querySelectorAll('.nav-links li a'); // Get all nav link anchors

    const activateNavLink = (id) => {
        navLiAnchors.forEach(link => {
            link.classList.remove('active');
            // Check href against the current section ID
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
            // Special check for hero section if its link is '#' or '#hero'
            else if ((id === 'hero' || id === '') && (link.getAttribute('href') === '#' || link.getAttribute('href') === '#hero')) {
                 link.classList.add('active');
            }
        });
    };

    const scrollSpy = () => {
        let currentSectionId = '';
        const scrollY = window.pageYOffset;
        const headerHeight = header ? header.offsetHeight : 0;
        // Adjust offset: Trigger a bit earlier (e.g., 150px below header top)
        const triggerOffset = headerHeight + 70;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - triggerOffset;
            // Check if the scroll position is within this section's bounds (approx)
            if (scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // If scrolled near the bottom, force activate the last link (contact)
        if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) { // 50px buffer from bottom
             const lastSection = sections[sections.length - 1];
             if (lastSection) {
                 currentSectionId = lastSection.getAttribute('id');
             }
        }
        // If scrolled near the top, handle hero section activation
        else if (scrollY < sections[0].offsetTop - triggerOffset) {
             // Check if there's a hero section (assumed ID 'hero' or linked via '#')
             const heroSection = document.getElementById('hero');
             if(heroSection){
                 currentSectionId = 'hero';
             } else {
                 currentSectionId = ''; // Or the ID of the first section if no dedicated hero
             }
        }

        activateNavLink(currentSectionId);
    };

    // Attach scroll event listener
    window.addEventListener('scroll', scrollSpy);

    // Trigger scroll event once on load to set initial active link
    // Use setTimeout to ensure layout is fully calculated after load
    setTimeout(scrollSpy, 100);

    const modalOverlay = document.getElementById('modal-overlay');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // --- Functions to control modal ---
    function showSuccessModal() {
        if(modalOverlay) {
            modalOverlay.classList.add('active');
        }
    }

    function hideSuccessModal() {
         if(modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    }

    // --- Close Modal Listeners ---
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', hideSuccessModal);
    }
    // Optional: Close modal if user clicks on the overlay background
    if(modalOverlay) {
        modalOverlay.addEventListener('click', function(event) {
            // Only close if the click is directly on the overlay, not the modal box itself
            if (event.target === modalOverlay) {
                hideSuccessModal();
            }
        });
    }


    const form = document.getElementById('cta-form');
    const formStatus = document.getElementById('form-status'); // Get the status div


    if (form) {
        const submitButton = form.querySelector('button[type="submit"]'); // Defined here

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(form);
            const formSubmitUrl = "https://formsubmit.co/amen.jouini18@gmail.com";

            // Update button state
            if(submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }
            if(formStatus) {
                formStatus.textContent = '';
                formStatus.style.color = 'inherit';
            }


            fetch(formSubmitUrl, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('Form submission successful (status ok).');
                    return Promise.resolve();
                } else {
                    return response.text().then(text => {
                        console.error("FormSubmit Error Response Body:", text);
                        throw new Error(`Form submission failed: ${response.status} ${response.statusText}`);
                    });
                }
            })
            .then(() => {
                console.log('Handling successful submission action...');

                // --- Perform Success Action: Show Modal ---
                showSuccessModal(); // <--- Show the pop-up!

                // Also reset the form and button
                form.reset(); // Clear the form fields
                if(submitButton) {
                    submitButton.disabled = false; // Re-enable button
                    submitButton.textContent = 'Contact Us'; // Reset button text
                }
                 if(formStatus) { // Clear any previous status messages
                    formStatus.textContent = '';
                 }

            })
            .catch(error => {
                console.error('Form Submission Error:', error);
                 if(formStatus) { // Display error inline
                    formStatus.textContent = "Oops! Something went wrong. Please try again.";
                    formStatus.style.color = 'red';
                 }
                // Ensure button is re-enabled on error
                 if(submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Contact Us';
                 }
            });
        });
    }

});