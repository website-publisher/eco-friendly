document.addEventListener('DOMContentLoaded', function () {
    const galleries = document.querySelectorAll('.product-gallery');
    const metricNumbers = document.querySelectorAll('.metric-number');
    const revealCards = document.querySelectorAll('.reveal-card');
    const faqQuestions = document.querySelectorAll('.faq-question');

    function animateCounter(element) {
        const target = Number(element.dataset.counter || 0);
        if (!Number.isFinite(target) || target <= 0) {
            element.textContent = '0';
            return;
        }

        const duration = 1300;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * easedProgress);
            element.textContent = value.toLocaleString('en-IN');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    if (metricNumbers.length > 0) {
        const section = document.querySelector('.impact-metrics');
        if (section) {
            let hasAnimated = false;
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        hasAnimated = true;
                        metricNumbers.forEach(animateCounter);
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.35 });

            observer.observe(section);
        }
    }

    if (revealCards.length > 0) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealCards.forEach(card => revealObserver.observe(card));
    }

    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isOpen = question.getAttribute('aria-expanded') === 'true';

                faqQuestions.forEach(otherQuestion => {
                    const answer = otherQuestion.nextElementSibling;
                    const icon = otherQuestion.querySelector('.faq-icon');

                    otherQuestion.setAttribute('aria-expanded', 'false');
                    if (answer) {
                        answer.hidden = true;
                    }
                    if (icon) {
                        icon.textContent = '+';
                    }
                });

                if (!isOpen) {
                    const answer = question.nextElementSibling;
                    const icon = question.querySelector('.faq-icon');

                    question.setAttribute('aria-expanded', 'true');
                    if (answer) {
                        answer.hidden = false;
                    }
                    if (icon) {
                        icon.textContent = '-';
                    }
                }
            });
        });
    }

    galleries.forEach(gallery => {
        const slides = gallery.querySelector('.slides');
        const images = slides.querySelectorAll('img');
        const prevButton = gallery.querySelector('.prev');
        const nextButton = gallery.querySelector('.next');

        let index = 0;
        let interval;

        function showSlide(n) {
            if (n >= images.length) {
                index = 0;
            } else if (n < 0) {
                index = images.length - 1;
            } else {
                index = n;
            }
            slides.style.transform = `translateX(${-index * 100}%)`;
            updateAria();
        }

        function updateAria() {
            // Update ARIA attributes for accessibility
            slides.setAttribute('aria-live', 'polite');
            slides.setAttribute('aria-label', `Image ${index + 1} of ${images.length}`);
        }

        function startAutoSlide() {
            interval = setInterval(function () {
                showSlide(index + 1);
            }, 5000); // Change image every 5 seconds
        }

        function stopAutoSlide() {
            clearInterval(interval);
        }

        prevButton.addEventListener('click', function () {
            showSlide(index - 1);
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide after manual action
        });

        nextButton.addEventListener('click', function () {
            showSlide(index + 1);
            stopAutoSlide();
            startAutoSlide(); // Restart auto slide after manual action
        });

        gallery.addEventListener('mouseenter', stopAutoSlide);
        gallery.addEventListener('mouseleave', startAutoSlide);

        // Keyboard Navigation
        gallery.addEventListener('keydown', function (event) {
            if (event.key === 'ArrowLeft') {
                showSlide(index - 1);
            } else if (event.key === 'ArrowRight') {
                showSlide(index + 1);
            }
        });

        // Start the auto slide initially
        startAutoSlide();
    });
});
