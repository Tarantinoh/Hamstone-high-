// ==================== LOAD DATA FROM JSON ====================
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        // Render hero slider
        renderHero(data.heroImages);
        
        // Render events
        renderEvents(data.events);
        
        // Render gallery
        renderGallery(data.gallery);
        
        // Initialize gallery filters AFTER data is loaded
        initGalleryFilters();
        
    } catch (error) {
        console.warn('Could not load data.json. Using fallback data.', error);
        // Use your existing hardcoded fallback data here
    }
}

function renderHero(images) {
    const slider = document.getElementById('slider');
    if (!slider || !images || images.length === 0) return;
    
    slider.innerHTML = '';
    images.forEach(img => {
        const div = document.createElement('div');
        div.className = 'min-w-full h-full bg-cover bg-center';
        div.style.backgroundImage = `url('${img}')`;
        slider.appendChild(div);
    });
    
    // Restart slider logic
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

function renderEvents(events) {
    const eventList = document.getElementById('eventList');
    if (!eventList) return;
    
    eventList.innerHTML = '';
    events.forEach(event => {
        const item = document.createElement('div');
        item.className = 'flex justify-between items-center border-b pb-2';
        item.innerHTML = `
            <span class="text-gray-700">${event.title}</span>
            <span class="text-sm text-gray-500">${event.date}</span>
        `;
        eventList.appendChild(item);
    });
}

// ==================== GALLERY WITH FILTERS ====================
let galleryData = [];

function renderGallery(images) {
    const container = document.getElementById('galleryContainer');
    if (!container) {
        console.warn('Gallery container not found');
        return;
    }
    
    galleryData = images || []; // Store globally for filter use
    console.log('Gallery data loaded:', galleryData.length, 'images');
    renderGalleryFiltered('all');
}

function renderGalleryFiltered(category = 'all') {
    const container = document.getElementById('galleryContainer');
    if (!container) {
        console.warn('Gallery container not found');
        return;
    }
    
    if (!galleryData || galleryData.length === 0) {
        console.warn('No gallery data available');
        container.innerHTML = '<p class="col-span-full text-center text-gray-500">No images found.</p>';
        return;
    }
    
    console.log(`Filtering gallery: ${category}`);
    const filtered = category === 'all' ? galleryData : galleryData.filter(img => img.category === category);
    console.log(`Found ${filtered.length} images for category: ${category}`);
    
    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-500">No images found in this category.</p>';
        return;
    }
    
    filtered.forEach(img => {
        const div = document.createElement('div');
        div.className = 'relative overflow-hidden rounded-lg shadow cursor-pointer';
        div.innerHTML = `<img src="${img.src}" alt="${img.alt || 'Gallery image'}" class="w-full h-48 object-cover">`;
        container.appendChild(div);
    });
}

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.gallery-filter');
    console.log('Found gallery filter buttons:', filterButtons.length);
    
    if (!filterButtons.length) {
        console.warn('No gallery filter buttons found – check your HTML for class="gallery-filter"');
        return;
    }
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log(`Gallery filter clicked: ${this.dataset.cat}`);
            
            // Remove active styles from all buttons
            filterButtons.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });
            // Add active style to clicked button
            this.classList.remove('bg-gray-200', 'text-gray-700');
            this.classList.add('bg-blue-600', 'text-white');
            
            // Filter gallery
            const category = this.dataset.cat;
            renderGalleryFiltered(category);
        });
    });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        console.log('Mobile menu initialized');
    } else {
        console.warn('Mobile menu elements not found');
    }
}

// ==================== DARK MODE TOGGLE ====================
function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            darkModeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
        });
        console.log('Dark mode initialized');
    } else {
        console.warn('Dark mode toggle not found');
    }
}

// ==================== ACADEMICS TABS ====================
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabBtns.length) {
        console.warn('No tab buttons found');
        return;
    }
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active styles from all buttons
            tabBtns.forEach(b => {
                b.classList.remove('bg-blue-600', 'text-white');
                b.classList.add('bg-gray-200', 'text-gray-700');
            });
            // Add active style to clicked button
            this.classList.remove('bg-gray-200', 'text-gray-700');
            this.classList.add('bg-blue-600', 'text-white');

            // Hide all tab contents
            tabContents.forEach(content => content.classList.add('hidden'));

            // Show the selected tab content
            const tabId = this.dataset.tab;
            const targetContent = document.getElementById(tabId);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                console.log(`Tab selected: ${tabId}`);
            } else {
                console.warn(`Tab content not found for: ${tabId}`);
            }
        });
    });
    console.log('Tabs initialized');
}

// ==================== STATS COUNTER ====================
function initStatsCounter() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) {
        console.warn('No stats counters found');
        return;
    }
    
    console.log('Found', counters.length, 'stats counters');
    const speed = 200; // lower = faster animation

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

    // Use Intersection Observer to start counting when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                // Only count if it's still at 0 (not counting yet)
                if (+counter.innerText === 0) {
                    countUp(counter);
                }
                observer.unobserve(counter); // Count only once
            }
        });
    }, { threshold: 0.3 }); // Trigger when 30% of the element is visible

    counters.forEach(counter => observer.observe(counter));
    
    // Fallback: if counters are already visible (e.g., on page load), start counting
    counters.forEach(counter => {
        const rect = counter.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (isVisible && +counter.innerText === 0) {
            countUp(counter);
            observer.unobserve(counter); // Stop observing this element
        }
    });
}


// ==================== SEARCH FUNCTIONALITY ====================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsSection = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');
    
    if (!searchInput) {
        console.warn('Search input not found');
        return;
    }
    
    if (!searchResultsSection || !resultsContainer) {
        console.warn('Search results elements not found');
        return;
    }
    
    console.log('Search initialized');
    
    // Create a searchable index of content
    const searchableContent = [
        { type: 'About', text: 'Hamstone High School is dedicated to fostering academic excellence, personal growth, and community spirit. With a rich history spanning 50 years, we prepare students for a bright future.' },
        { type: 'News', text: 'School Reopens Monday After spring break, we look forward to welcoming all students back.' },
        { type: 'News', text: 'Science Fair Winners Congratulations to our winners: Team A for their solar project!' },
        { type: 'Staff', text: 'Dr. Sarah Smith Science' },
        { type: 'Staff', text: 'Mr. John Davis Math' },
        { type: 'Staff', text: 'Ms. Emily Brown English' },
        { type: 'Events', text: 'Sports Day March 15, 2025' },
        { type: 'Events', text: 'Parent-Teacher Meeting March 20, 2025' },
    ];

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase().trim();
        console.log('Search query:', query);
        
        if (query === '') {
            searchResultsSection.classList.add('hidden');
            return;
        }

        const results = searchableContent.filter(item => 
            item.text.toLowerCase().includes(query)
        );
        
        console.log('Found results:', results.length);
        
        if (results.length > 0) {
            resultsContainer.innerHTML = results.map(item => 
                `<div class="border-b py-2"><strong>${item.type}:</strong> ${item.text}</div>`
            ).join('');
            searchResultsSection.classList.remove('hidden');
        } else {
            resultsContainer.innerHTML = '<p class="text-gray-500">No results found.</p>';
            searchResultsSection.classList.remove('hidden');
        }
    });
}


/// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded – initializing...');
    
    initMobileMenu();
    initDarkMode();
    initTabs();
    initStatsCounter();
    initSearch(); // 👈 ADD THIS LINE
    
    loadData();
});