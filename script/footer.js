document.addEventListener('DOMContentLoaded', function() {
    const backToTop = document.querySelector('.back-to-top');
    const newsletterForms = document.querySelectorAll('.newsletter-signup form, .subscribe-form');
    
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value.trim() : '';

            if (!email) {
                alert('Please enter an email address to subscribe.');
                return;
            }

            alert('Thanks for subscribing with ' + email + '!');
            form.reset();
        });
    });
});