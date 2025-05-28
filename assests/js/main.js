// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });

    // Active navigation link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Statistics animation on scroll
    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
        const animateStats = () => {
            const rect = statsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const statNumbers = statsSection.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        stat.classList.add('animated');
                        animateNumber(stat);
                    }
                });
            }
        };

        window.addEventListener('scroll', animateStats);
    }

    // Animate numbers function
    function animateNumber(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, '')) || 0;
        const suffix = text.replace(/[\d,]/g, '');
        const duration = 2000;
        const increment = number / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current).toLocaleString() + suffix;
        }, 16);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation on scroll
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

    // Observe all animated elements
    document.querySelectorAll('.animate-fadeInUp, .animate-fadeInLeft, .animate-fadeInRight').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Form validation and submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner me-2"></span>Processing...';

            // Simulate form submission
            setTimeout(() => {
                alert('Form submitted successfully! We will get back to you soon.');

                // Reset form
                form.reset();

                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 2000);
        });
    });

    // Course filter functionality (for courses page)
    if (window.location.pathname.includes('courses.html')) {
        initializeCourseFilters();
    }

    // Course detail functionality
    if (window.location.pathname.includes('course-detail.html')) {
        initializeCourseDetail();
    }
});

// Course filters functionality
function initializeCourseFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const courseCards = document.querySelectorAll('.course-card');

    if (categoryFilter && levelFilter) {
        [categoryFilter, levelFilter].forEach(filter => {
            filter.addEventListener('change', filterCourses);
        });
    }

    function filterCourses() {
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        const selectedLevel = levelFilter ? levelFilter.value : 'all';

        courseCards.forEach(card => {
            const category = card.dataset.category || '';
            const level = card.dataset.level || '';

            const categoryMatch = selectedCategory === 'all' || category === selectedCategory;
            const levelMatch = selectedLevel === 'all' || level === selectedLevel;

            if (categoryMatch && levelMatch) {
                card.style.display = 'block';
                card.parentElement.style.display = 'block';
            } else {
                card.style.display = 'none';
                card.parentElement.style.display = 'none';
            }
        });

        // Update results count
        const visibleCards = document.querySelectorAll('.course-card[style*="block"], .course-card:not([style*="none"])');
        const resultsText = document.getElementById('resultsCount');
        if (resultsText) {
            resultsText.textContent = `Showing ${visibleCards.length} course${visibleCards.length !== 1 ? 's' : ''}`;
        }
    }
}

// Course detail functionality
function initializeCourseDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');

    if (courseId) {
        loadCourseData(courseId);
    }
}

// Course data
const courseData = {
    'web-development': {
        title: 'Full Stack Web Development',
        subtitle: 'Master modern web development from frontend to backend',
        price: '$999',
        originalPrice: '$1299',
        duration: '6 Months',
        level: 'Beginner to Advanced',
        students: 2500,
        rating: 4.8,
        reviews: 450,
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
        instructor: {
            name: 'John Smith',
            title: 'Senior Full Stack Developer',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            experience: '8+ years industry experience'
        },
        description: 'This comprehensive course will take you from a complete beginner to a job-ready full stack developer.',
        whatYouLearn: [
            'Build responsive websites using HTML5, CSS3, and JavaScript',
            'Master React.js and Redux for frontend development',
            'Develop backend APIs using Node.js and Express',
            'Work with MongoDB and database design',
            'Implement user authentication and authorization',
            'Deploy applications to cloud platforms'
        ]
    },
    'data-science': {
        title: 'Data Science & Machine Learning',
        subtitle: 'Transform data into actionable insights with Python and ML',
        price: '$1299',
        originalPrice: '$1699',
        duration: '8 Months',
        level: 'Intermediate',
        students: 1800,
        rating: 4.9,
        reviews: 320,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        instructor: {
            name: 'Dr. Sarah Wilson',
            title: 'Senior Data Scientist',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            experience: '10+ years in data science and AI'
        },
        description: 'Comprehensive data science program covering everything from data analysis to machine learning deployment.',
        whatYouLearn: [
            'Python programming for data science',
            'Data manipulation with Pandas and NumPy',
            'Statistical analysis and hypothesis testing',
            'Data visualization with Matplotlib and Seaborn',
            'Machine learning algorithms and implementation',
            'Deep learning with TensorFlow and Keras'
        ]
    }
};

function loadCourseData(courseId) {
    const course = courseData[courseId];
    if (!course) return;

    // Update page title
    document.title = `${course.title} - EduTech Institute`;

    // Update hero section if elements exist
    const heroTitle = document.getElementById('courseTitle');
    const heroSubtitle = document.getElementById('courseSubtitle');
    const heroImage = document.getElementById('courseImage');

    if (heroTitle) heroTitle.textContent = course.title;
    if (heroSubtitle) heroSubtitle.textContent = course.subtitle;
    if (heroImage) heroImage.src = course.image;
}

// Utility functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
