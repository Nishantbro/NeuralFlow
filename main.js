// ===================================
// Theme Toggle Dark/Light Mode
// ===================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        // Use saved preference
        if (savedTheme === 'light') {
            htmlElement.classList.add('light-mode');
        } else {
            htmlElement.classList.remove('light-mode');
        }
    } else if (prefersDark) {
        // Use system preference (dark is default, so don't add class)
        htmlElement.classList.remove('light-mode');
    }
}

// Initialize theme on page load
initializeTheme();

// Theme toggle click handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('light-mode');
        
        // Save preference to localStorage
        const currentTheme = htmlElement.classList.contains('light-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        
        // Add visual feedback
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 400);
    });
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        // Only apply if user hasn't set a preference
        if (e.matches) {
            htmlElement.classList.remove('light-mode');
        } else {
            htmlElement.classList.add('light-mode');
        }
    }
});

// ===================================
// Mobile Navigation Toggle
// ===================================

const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const body = document.body;

// Toggle mobile menu
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Update ARIA attributes for accessibility
        const isExpanded = navMenu.classList.contains('active');
        mobileToggle.setAttribute('aria-expanded', isExpanded);
    });
}

// Close mobile menu when clicking on a nav link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.classList.remove('menu-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active')) {
        const isClickInsideNav = navMenu.contains(e.target);
        const isClickOnToggle = mobileToggle.contains(e.target);
        
        if (!isClickInsideNav && !isClickOnToggle) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.classList.remove('menu-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Close menu on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        body.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
});

// Close menu on window resize if it's open
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
            body.classList.remove('menu-open');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }, 250);
});

// ===================================
// Header Scroll Effect
// ===================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class for styling
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===================================
// Smooth Scroll Animation
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Intersection Observer for Fade-in Animations
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and use cases
const animatedElements = document.querySelectorAll('.feature-card, .use-case');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// Button Click Effects
// ===================================

const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
    // Handle both click and touch events
    const handleInteraction = function(e) {
        // Prevent default on touch to avoid ghost clicks
        if (e.type === 'touchstart') {
            e.preventDefault();
        }
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        let x, y;
        if (e.type === 'touchstart') {
            x = e.touches[0].clientX - rect.left - size / 2;
            y = e.touches[0].clientY - rect.top - size / 2;
        } else {
            x = e.clientX - rect.left - size / 2;
            y = e.clientY - rect.top - size / 2;
        }
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
        
        // Log button action (for demo purposes)
        console.log(`Button clicked: ${this.textContent}`);
        
        // You can add actual functionality here
        // For example: form submission, modal opening, etc.
    };
    
    button.addEventListener('click', handleInteraction);
    button.addEventListener('touchstart', handleInteraction, { passive: false });
});

// ===================================
// Dynamic Stats Counter Animation
// ===================================

const stats = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const text = target.textContent;
            
            // Only animate numbers
            if (text.includes('%') || text.includes('+')) {
                animateNumber(target);
            }
            
            statsObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

stats.forEach(stat => statsObserver.observe(stat));

function animateNumber(element) {
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const hasPlus = text.includes('+');
    const numMatch = text.match(/\d+/);
    
    if (!numMatch) return;
    
    const targetNum = parseInt(numMatch[0]);
    const duration = 2000;
    const steps = 60;
    const increment = targetNum / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
            current = targetNum;
            clearInterval(timer);
        }
        
        let displayText = Math.floor(current).toString();
        if (hasPercent) displayText += '%';
        if (hasPlus) displayText += '+';
        
        element.textContent = displayText;
    }, duration / steps);
}

// ===================================
// Performance Optimization: Debounce Scroll
// ===================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===================================
// Console Welcome Message
// ===================================

console.log('%c NeuralFlow AI', 'color: #00D9FF; font-size: 24px; font-weight: bold;');
console.log('%c Advanced AI & Automation Solutions', 'color: #A8B2C1; font-size: 14px;');
console.log('%c Website loaded successfully', 'color: #00FF00; font-size: 12px;');
