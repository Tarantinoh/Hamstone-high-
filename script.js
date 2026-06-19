// ==================== LOAD DATA FROM CMS ====================
async function loadCMSData() {
    try {
        // Fetch all data files from the /data folder
        const responses = await Promise.all([
            fetch('data/hero.json').then(r => r.json()).catch(() => []),
            fetch('data/events.json').then(r => r.json()).catch(() => []),
            fetch('data/gallery.json').then(r => r.json()).catch(() => []),
            fetch('data/staff.json').then(r => r.json()).catch(() => []),
            fetch('data/news.json').then(r => r.json()).catch(() => []),
            fetch('data/about.json').then(r => r.json()).catch(() => null)
        ]);
        
        const [heroData, eventsData, galleryData, staffData, newsData, aboutData] = responses;
        
        // Render all sections
        renderHero(heroData);
        renderEvents(eventsData);
        renderGallery(galleryData);
        renderStaff(staffData);
        renderNews(newsData);
        renderAbout(aboutData);
        
        // Re-run any observers or initializations
        initializeObservers();
    } catch (error) {
        console.warn('Could not load CMS data. Falling back to hardcoded data.', error);
        // You can keep your hardcoded data as fallback here
        renderHeroFallback();
        renderEventsFallback();
        renderGalleryFallback();
        renderStaffFallback();
        renderNewsFallback();
        renderAboutFallback();
    }
}

// ==================== RENDER FUNCTIONS ====================

function renderHero(data) {
    const slider = document.getElementById('slider');
    if (!slider) return;
    
    if (!data || !data.images || data.images.length === 0) {
        // Use fallback if no CMS data
        renderHeroFallback();
        return;
    }
    
    // Sort by order
    const images = data.images.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    slider.innerHTML = '';
    images.forEach(img => {
        const div = document.createElement('div');
        div.className = 'min-w-full h-full bg-cover bg-center';
        div.style.backgroundImage = `url('${img.image}')`;
        div.setAttribute('role', 'img');
        div.setAttribute('aria-label', img.alt || 'Hamstone High School');
        slider.appendChild(div);
    });
    
    // Restart slider animation
    let slideIndex = 0;
    const slides = slider.children.length;
    if (slides > 1) {
        function showNextSlide() {
            slideIndex = (slideIndex + 1) % slides;
            slider.style.transform = `translateX(-${slideIndex * 100}%)`;
        }
        setInterval(showNextSlide, 4000);
    }
}

function renderEvents(data) {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    
    if (!data || data.length === 0) {
        renderEventsFallback();
        return;
    }
    
    eventList.innerHTML = '';
    // Show only upcoming events (optional: sort by date)
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    data.forEach(event => {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center border-b pb-2';
        item.innerHTML = `
            <span class="text-gray-700">${event.title}</span>
            <span class="text-sm text-gray-500">${event.date}</span>
        `;
        eventList.appendChild(item);
    });
}

function renderGallery(data) {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    
    if (!data || data.length === 0) {
        renderGalleryFallback();
        return;
    }
    
    // Filter function will be called on button click
    window.galleryData = data;
    renderGalleryFiltered('all');
}

function renderGalleryFiltered(category = 'all') {
    const container = document.getElementById('galleryContainer');
    if (!container || !window.galleryData) return;
    
    container.innerHTML = '';
    const filtered = category === 'all' ? window.galleryData : window.galleryData.filter(img => img.category === category);
    
    filtered.forEach(img => {
        const div = document.createElement('div');
        div.className = 'relative overflow-hidden rounded-lg shadow cursor-pointer';
        div.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Gallery image'}" class="w-full h-48 object-cover">`;
        container.appendChild(div);
    });
}

// ==================== FALLBACK DATA (if CMS not ready) ====================

function renderHeroFallback() {
    const slider = document.getElementById('slider');
    if (!slider) return;
    // Your existing hardcoded hero images
    slider.innerHTML = `
        <div class="min-w-full h-full bg-cover bg-center" style="background-image: url('https://source.unsplash.com/1600x900/?school,campus');"></div>
        <div class="min-w-full h-full bg-cover bg-center" style="background-image: url('https://source.unsplash.com/1600x900/?students,classroom');"></div>
        <div class="min-w-full h-full bg-cover bg-center" style="background-image: url('https://source.unsplash.com/1600x900/?library,books');"></div>
    `;
}

function renderEventsFallback() {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    eventList.innerHTML = `
        <div class="flex justify-between items-center border-b pb-2"><span class="text-gray-700">Sports Day</span><span class="text-sm text-gray-500">March 15, 2026</span></div>
        <div class="flex justify-between items-center border-b pb-2"><span class="text-gray-700">Science Fair</span><span class="text-sm text-gray-500">April 10, 2026</span></div>
        <div class="flex justify-between items-center border-b pb-2"><span class="text-gray-700">Parent-Teacher Meeting</span><span class="text-sm text-gray-500">May 5, 2026</span></div>
    `;
}

function renderGalleryFallback() {
    const container = document.getElementById('galleryContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="relative overflow-hidden rounded-lg shadow"><img src="https://source.unsplash.com/400x300/?sports" class="w-full h-48 object-cover"></div>
        <div class="relative overflow-hidden rounded-lg shadow"><img src="https://source.unsplash.com/400x300/?classroom" class="w-full h-48 object-cover"></div>
        <div class="relative overflow-hidden rounded-lg shadow"><img src="https://source.unsplash.com/400x300/?graduation" class="w-full h-48 object-cover"></div>
        <div class="relative overflow-hidden rounded-lg shadow"><img src="https://source.unsplash.com/400x300/?basketball" class="w-full h-48 object-cover"></div>
    `;
}

function renderStaff(data) {
    const container = document.getElementById('staffContainer');
    if (!container) return;
    // You'll need to add staff container to your HTML if not already
    // For now, keep commented or add placeholder
}

function renderNews(data) {
    const container = document.getElementById('newsContainer');
    if (!container) return;
    // You'll need to add news container to your HTML if not already
}

function renderAbout(data) {
    // Update about section with CMS data if available
}

// ==================== MOBILE MENU ====================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// ==================== STATS COUNTER ====================
function initializeObservers() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;
    
    const speed = 200;
    const countUp = (counter) => {
        const target = +counter.getAttribute('data-target');
        const current = +counter.innerText;
        const increment = target / speed;
        if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(() => countUp(counter), 10);
        } else {
            counter.innerText = target;
        }
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ==================== ACADEMICS TABS ====================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        btn.classList.remove('bg-gray-200', 'text-gray-700');
        btn.classList.add('bg-blue-600', 'text-white');
        tabContents.forEach(content => content.classList.add('hidden'));
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.remove('hidden');
    });
});

// ==================== CONTACT FORM ====================
const form = document.getElementById('contactForm');
if (form) {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (formSuccess) formSuccess.classList.add('hidden');
        if (formError) formError.classList.add('hidden');
        [nameError, emailError, messageError].forEach(err => { if (err) err.classList.add('hidden'); });
        
        let isValid = true;
        if (nameInput.value.trim() === '') {
            if (nameError) nameError.classList.remove('hidden');
            isValid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            if (emailError) emailError.classList.remove('hidden');
            isValid = false;
        }
        if (messageInput.value.trim() === '') {
            if (messageError) messageError.classList.remove('hidden');
            isValid = false;
        }
        if (!isValid) return;
        
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;
        const formData = new FormData(form);
        try {
            const response = await fetch('https://formspree.io/f/xgonnpbn', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                form.reset();
                if (formSuccess) formSuccess.classList.remove('hidden');
            } else {
                throw new Error('Formspree error');
            }
        } catch (error) {
            if (formError) formError.classList.remove('hidden');
            console.error('Form error:', error);
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==================== DARK MODE TOGGLE ====================
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        darkModeToggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
    });
}

// ==================== SEARCH ====================
const searchInput = document.getElementById('searchInput');
const searchResultsSection = document.getElementById('searchResults');
const resultsContainer = document.getElementById('resultsContainer');
if (searchInput && searchResultsSection && resultsContainer) {
    const searchableContent = [
        { type: 'About', text: 'Hamstone High School is dedicated to fostering academic excellence, personal growth, and community spirit.' },
        { type: 'News', text: 'School Reopens Monday After spring break, we look forward to welcoming all students back.' },
        { type: 'Events', text: 'Sports Day March 15, 2025' },
        { type: 'Events', text: 'Parent-Teacher Meeting March 20, 2025' },
    ];
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query === '') {
            searchResultsSection.classList.add('hidden');
            return;
        }
        const results = searchableContent.filter(item => item.text.toLowerCase().includes(query));
        if (results.length > 0) {
            resultsContainer.innerHTML = results.map(item => `<div class="border-b py-2"><strong>${item.type}:</strong> ${item.text}</div>`).join('');
            searchResultsSection.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            searchResultsSection.classList.remove('hidden');
        }
    });
}

// ==================== GALLERY FILTER BUTTONS ====================
document.querySelectorAll('.gallery-filter').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.gallery-filter').forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white');
            b.classList.add('bg-gray-200', 'text-gray-700');
        });
        btn.classList.remove('bg-gray-200', 'text-gray-700');
        btn.classList.add('bg-blue-600', 'text-white');
        renderGalleryFiltered(btn.dataset.cat);
    });
});

// ==================== INITIALIZE ====================
// Load CMS data on page load
document.addEventListener('DOMContentLoaded', loadCMSData);

// Also load if DOM already loaded (just in case)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    loadCMSData();
}