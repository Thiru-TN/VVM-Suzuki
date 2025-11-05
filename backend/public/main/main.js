document.addEventListener("DOMContentLoaded", function () {
    // =====================================================
    // USER AUTHENTICATION & DISPLAY SYSTEM
    // =====================================================
    
    function updateUserDisplay() {
        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem('user')) || null;
        
        if (user && user.name) {
            // Desktop nav - Update the span next to user icon
            const desktopUserSpans = document.querySelectorAll('.nav-desktop .nav-btn span, .shellbar .nav-btn span, .user-name-display');
            desktopUserSpans.forEach(span => {
                if (span) {
                    span.textContent = user.name;
                    span.setAttribute('data-user', 'logged-in');
                }
            });

            // Mobile nav - Update the span next to user icon
            const mobileUserSpans = document.querySelectorAll('.nav-mobile .mobile-nav-btn span, .mobile-user-name-display');
            mobileUserSpans.forEach(span => {
                if (span) {
                    span.textContent = user.name;
                    span.setAttribute('data-user', 'logged-in');
                }
            });

            // Update profile sections if they exist
            const profileNameElements = document.querySelectorAll('#profileName, #mobileProfileName, .profile-user-name');
            profileNameElements.forEach(element => {
                if (element) {
                    element.textContent = user.name;
                }
            });

            // Update welcome messages
            const welcomeElements = document.querySelectorAll('.welcome-message, .user-welcome');
            welcomeElements.forEach(element => {
                if (element) {
                    element.textContent = `Welcome back, ${user.name}!`;
                }
            });

            console.log(`User logged in: ${user.name}`);
        } else {
            // Handle no user case - show 'Guest' or login prompt
            const desktopUserSpans = document.querySelectorAll('.nav-desktop .nav-btn span, .shellbar .nav-btn span, .user-name-display');
            desktopUserSpans.forEach(span => {
                if (span) {
                    span.textContent = 'Guest';
                    span.setAttribute('data-user', 'guest');
                }
            });

            const mobileUserSpans = document.querySelectorAll('.nav-mobile .mobile-nav-btn span, .mobile-user-name-display');
            mobileUserSpans.forEach(span => {
                if (span) {
                    span.textContent = 'Guest';
                    span.setAttribute('data-user', 'guest');
                }
            });

            const profileNameElements = document.querySelectorAll('#profileName, #mobileProfileName, .profile-user-name');
            profileNameElements.forEach(element => {
                if (element) {
                    element.textContent = 'Guest User';
                }
            });

            const welcomeElements = document.querySelectorAll('.welcome-message, .user-welcome');
            welcomeElements.forEach(element => {
                if (element) {
                    element.textContent = 'Welcome, Guest!';
                }
            });

            console.log('No user logged in - showing guest');
        }
    }

    // =====================================================
    // ENHANCED USER MANAGEMENT FUNCTIONS
    // =====================================================
    
    // Function to set user data (call this when user logs in)
    window.setUserData = function(userData) {
        if (userData && typeof userData === 'object') {
            localStorage.setItem('user', JSON.stringify(userData));
            updateUserDisplay();
            
            // Show success notification
            if (typeof showNotification === 'function') {
                showNotification('success', 'Login Successful', `Welcome back, ${userData.name}!`);
            }
            
            // Dispatch custom event for other parts of the app
            window.dispatchEvent(new CustomEvent('userLoggedIn', { 
                detail: userData 
            }));
        } else {
            console.error('Invalid user data provided');
        }
    };

    // Function to get current user data
    window.getCurrentUser = function() {
        return JSON.parse(localStorage.getItem('user')) || null;
    };

    // Function to clear user data (call this when user logs out)
    window.clearUserData = function() {
        localStorage.removeItem('user');
        updateUserDisplay();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
    };

    // Function to update user profile
    window.updateUserProfile = function(newData) {
        const currentUser = getCurrentUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...newData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            updateUserDisplay();
            
            if (typeof showNotification === 'function') {
                showNotification('success', 'Profile Updated', 'Your profile has been updated successfully');
            }
        }
    };

   

    // =====================================================
    // EVENT LISTENERS FOR USER ACTIONS
    // =====================================================
    
    // Listen for storage changes (if user data changes in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'user') {
            updateUserDisplay();
        }
    });

    // Listen for custom events
    window.addEventListener('userLoggedIn', function(e) {
        console.log('User logged in event received:', e.detail);
    });

    window.addEventListener('userLoggedOut', function(e) {
        console.log('User logged out event received');
    });

    // =====================================================
    // MOBILE MENU AND NAVIGATION
    // =====================================================
    
    // Mobile menu toggle
    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
        navToggle.addEventListener("click", function () {
            document.body.classList.toggle("nav-open");
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !e.target.closest(".shellbar-container") &&
            !e.target.closest(".nav-mobile") &&
            document.body.classList.contains("nav-open")
        ) {
            document.body.classList.remove("nav-open");
        }
    });

    // =====================================================
    // NOTIFICATION SYSTEM
    // =====================================================
    
    function showNotification(type, title, message, duration = 4000) {
        const notification = document.getElementById("notification");
        if (!notification) return;

        const iconMap = {
            success: "fa-check-circle",
            error: "fa-exclamation-circle",
            warning: "fa-exclamation-triangle",
            info: "fa-info-circle",
        };

        notification.className = `notification ${type} show`;
        const icon = notification.querySelector(".notification-icon i");
        if (icon) icon.className = `fas ${iconMap[type] || "fa-info-circle"}`;

        const titleEl = notification.querySelector(".notification-title");
        if (titleEl) titleEl.textContent = title;

        const messageEl = notification.querySelector(".notification-message");
        if (messageEl) messageEl.textContent = message;

        setTimeout(() => {
            notification.classList.remove("show");
        }, duration);

        const closeBtn = notification.querySelector(".notification-close");
        if (closeBtn) {
            closeBtn.onclick = function () {
                notification.classList.remove("show");
            };
        }
    }

    // Make showNotification globally available
    window.showNotification = showNotification;

    // =====================================================
    // LOGOUT MODAL SYSTEM
    // =====================================================
    
    const logoutModal = document.getElementById("logoutModal");
    const logoutButtons = document.querySelectorAll(".logout-btn, .mobile-logout-btn");
    const modalClose = document.querySelector(".modal-close");
    const cancelBtn = document.querySelector(".btn-cancel");
    const confirmBtn = document.querySelector(".btn-confirm");

    function openModal() {
        if (logoutModal) {
            logoutModal.classList.add("show");
            document.body.classList.remove("nav-open");
        }
    }

    function closeModal() {
        if (logoutModal) {
            logoutModal.classList.remove("show");
        }
    }

    logoutButtons.forEach((button) => {
        button.addEventListener("click", openModal);
    });

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (cancelBtn) cancelBtn.addEventListener("click", closeModal);

    if (logoutModal) {
        logoutModal.addEventListener("click", function (e) {
            if (e.target === logoutModal) {
                closeModal();
            }
        });
    }

    if (confirmBtn) {
        confirmBtn.addEventListener("click", function () {
            closeModal();
            
            // Get current user before clearing
            const currentUser = getCurrentUser();
            const userName = currentUser ? currentUser.name : 'User';
            
            // Clear user data
            clearUserData();
            
            showNotification(
                "success",
                "Logged Out",
                `Goodbye ${userName}! You have been successfully logged out`
            );
            
            setTimeout(() => {
                window.location.href = "../login/login.html";
            }, 1500);
        });
    }

    // Show welcome notification with actual user name
    setTimeout(() => {
        const currentUser = getCurrentUser();
        const userName = currentUser ? currentUser.name : 'User';
        
        showNotification(
            "success",
            "Welcome Back",
            `You have successfully logged in as ${userName}`
        );
    }, 1000);

    // =====================================================
    // MAIN NAVIGATION SYSTEM
    // =====================================================
    
    let currentActiveSection = null;
    let morphingInterval = null;
    const isMobile = () => window.innerWidth <= 768;

    const wrapper = document.getElementById("wrapper");
    const dashboardContainer = document.getElementById("dashboardContainer");
    const sidebarContainer = document.getElementById("sidebarContainer");
    const contentArea = document.getElementById("contentArea");
    const bottomNav = document.getElementById("bottomNav");

    // Desktop Section Management
    function activateDesktopSection(sectionName) {
        if (currentActiveSection === sectionName) {
            deactivateAllSections();
            return;
        }

        currentActiveSection = sectionName;
        dashboardContainer.classList.add("hidden");
        sidebarContainer.classList.add("active");

        document.querySelectorAll(".sidebar-shapes .shape").forEach((shape) => {
            shape.classList.remove("active");
        });
        document.querySelectorAll(".content-section").forEach((section) => {
            section.classList.remove("active");
        });

        const leftShape = document.querySelector(`#leftSidebar .shape[data-section="${sectionName}"]`);
        const rightShape = document.querySelector(`#rightSidebar .shape[data-section="${sectionName}"]`);

        if (leftShape) leftShape.classList.add("active");
        if (rightShape) rightShape.classList.add("active");

        const contentSection = document.getElementById(`${sectionName}Section`);
        if (contentSection) {
            setTimeout(() => {
                contentSection.classList.add("active");
            }, 300);
        }

        clearInterval(morphingInterval);
    }

    // Mobile Section Management
    function activateMobileSection(sectionName) {
        if (currentActiveSection === sectionName) {
            deactivateAllSections();
            return;
        }

        currentActiveSection = sectionName;
        dashboardContainer.classList.add("hidden");

        document.querySelectorAll(".bottom-nav-item").forEach((item) => {
            item.classList.remove("active");
        });
        document.querySelectorAll(".mobile-content").forEach((section) => {
            section.classList.remove("active");
        });

        const navItem = document.querySelector(`.bottom-nav-item[data-section="${sectionName}"]`);
        if (navItem) navItem.classList.add("active");

        bottomNav.classList.add("active");

        const mobileSection = document.getElementById(
            `mobile${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}Section`
        );
        if (mobileSection) {
            setTimeout(() => {
                mobileSection.classList.add("active");
            }, 300);
        }

        clearInterval(morphingInterval);
    }

    // Deactivate all sections and return to initial state
    function deactivateAllSections() {
        currentActiveSection = null;

        sidebarContainer.classList.remove("active");
        document.querySelectorAll(".sidebar-shapes .shape").forEach((shape) => {
            shape.classList.remove("active");
        });
        document.querySelectorAll(".content-section").forEach((section) => {
            section.classList.remove("active");
        });

        document.querySelectorAll(".bottom-nav-item").forEach((item) => {
            item.classList.remove("active");
        });
        document.querySelectorAll(".mobile-content").forEach((section) => {
            section.classList.remove("active");
        });
        bottomNav.classList.remove("active");

        setTimeout(() => {
            dashboardContainer.classList.remove("hidden");
            startMainMorphing();
        }, 300);
    }

    // Main morphing functionality
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
    const uniqueRand = (min, max, prev) => {
        let next = prev;
        while (prev === next) next = rand(min, max);
        return next;
    };

    const combinations = [
        { configuration: 1, roundness: 1 },
        { configuration: 1, roundness: 2 },
        { configuration: 1, roundness: 4 },
        { configuration: 2, roundness: 2 },
        { configuration: 2, roundness: 3 },
        { configuration: 3, roundness: 3 },
    ];

    let prev = 0;

    function startMainMorphing() {
        clearInterval(morphingInterval);
        morphingInterval = setInterval(() => {
            if (!currentActiveSection && !dashboardContainer.classList.contains("hidden")) {
                const index = uniqueRand(0, combinations.length - 1, prev);
                const combination = combinations[index];

                if (wrapper) {
                    wrapper.dataset.configuration = combination.configuration;
                    wrapper.dataset.roundness = combination.roundness;
                }

                prev = index;
            }
        }, 3000);
    }

    startMainMorphing();

    // Mouse movement effect for main shapes
    if (wrapper) {
        wrapper.onmousemove = (e) => {
            const shapes = wrapper.getElementsByClassName("shape");
            for (const shape of shapes) {
                const rect = shape.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                shape.style.setProperty("--mouse-x", `${x}px`);
                shape.style.setProperty("--mouse-y", `${y}px`);
            }
        };
    }

    // Shape click handlers - Main dashboard shapes
    const mainShapes = document.querySelectorAll("#wrapper .shape");
    mainShapes.forEach((shape) => {
        shape.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const sectionName = this.getAttribute("data-section");
            if (sectionName) {
                if (isMobile()) {
                    activateMobileSection(sectionName);
                } else {
                    activateDesktopSection(sectionName);
                }
            }
        });
    });

    // Sidebar shape click handlers
    const sidebarShapes = document.querySelectorAll(".sidebar-shapes .shape");
    sidebarShapes.forEach((shape) => {
        shape.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const sectionName = this.getAttribute("data-section");
            if (sectionName) {
                if (currentActiveSection === sectionName) {
                    deactivateAllSections();
                } else {
                    activateDesktopSection(sectionName);
                }
            }
        });
    });

    // Bottom navigation click handlers
    const bottomNavItems = document.querySelectorAll(".bottom-nav-item");
    bottomNavItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const sectionName = this.getAttribute("data-section");
            if (sectionName) {
                if (currentActiveSection === sectionName) {
                    deactivateAllSections();
                } else {
                    activateMobileSection(sectionName);
                }
            }
        });
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const wasMobile = currentActiveSection && bottomNav.classList.contains("active");
            const isNowMobile = isMobile();

            if (wasMobile && !isNowMobile) {
                deactivateAllSections();
            } else if (!wasMobile && isNowMobile && currentActiveSection) {
                const section = currentActiveSection;
                deactivateAllSections();
                setTimeout(() => {
                    activateMobileSection(section);
                }, 300);
            }
        }, 250);
    });

    // Close on escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (currentActiveSection) {
                deactivateAllSections();
            }
        }
    });

    if (contentArea) {
        contentArea.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    // Close sections when clicking outside (desktop only)
    document.addEventListener("click", function (e) {
        if (!isMobile() && currentActiveSection) {
            if (
                !e.target.closest(".sidebar-container") &&
                !e.target.closest("#wrapper") &&
                !e.target.closest(".shellbar")
            ) {
                deactivateAllSections();
            }
        }
    });

    // Initialize first content section as active for desktop
    const firstContentSection = document.getElementById("quotationSection");
    if (firstContentSection && !isMobile()) {
        firstContentSection.classList.add("active");
    }
});

// =====================================================
// GALLERY DESKTOP JAVASCRIPT
// =====================================================

let galleryCurrentIndex = 0;
const galleryImages = [
    'https://lh3.googleusercontent.com/p/AF1QipMgiQiSxeq-_2Vmu03NAINvpDf1aqFIlHqj_hYp=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AC9h4npjEaZX14Fnd8GmAWT2dw3Z_n5K5v1Xx6OQnvOwjov7YwcUxjhfeoywVaPv5I-fqEZis5obGMGt1roKPXvUxYA0xC7mjouGwSDHsaYDIkElTW9ZLUv5KUMnKj0KV1bsq6uT9KGRuA0KAic=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nr49H3yvtCQ7hZuplRHCNonrjPWXIFo3ltsyVcrD6DTaV1KMPDpLPE2S3i3FiZdYcFdgYRDlMRJn0nk6o5Dh3F9Bk1xQY9Z1emI_9JvsMtCv9AdHSHS-31qxwp25JaQtXNaui8xhIbOj34=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqUNwkQQb51bZGZmOpNmJli5GxeLkxirwLilPSSZIDw4Xcef7XKuUZF8iHvgIAbtxuj7xLXySScxLKzXkcqS5MgwqejTKtv7X0m_bRGz63XAWgTEzYSfsSSGu8ecg1fQBCpYKsjjhnpn6IU=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AC9h4nqKiBflG9YGD_PAk8oFmEReny02g7-vSu9lblFSqMQGAtG06Dec08b9NUiIxuWpHST43nEALAPtl4qt_CSMwBoPnF680WjWvr1mbNhiC8mYlw-HlR0HECcLWggEIScTuCBquc5nR1GqLQQR=s1360-w1360-h1020-rw'
];

const galleryTitles = [
    'Motorcycle 1', 'Motorcycle 2', 'Motorcycle 3', 'Motorcycle 4', 'Motorcycle 5', 'Motorcycle 6'
];

const gallerySubtitles = [
    'Premium Collection', 'Sport Series', 'Classic Edition', 'Adventure Series', 'Limited Edition', 'Street Collection'
];

// Gallery mouse tracking for glow effect
document.addEventListener('DOMContentLoaded', function() {
    const galleryCards = document.getElementById("gallery-cards");
    if (galleryCards) {
        galleryCards.onmousemove = (e) => {
            for (const card of document.getElementsByClassName("gallery-card")) {
                const rect = card.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            }
        };
    }
});

function updateGalleryCards() {
    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach((card, index) => {
        const imageDiv = card.querySelector('.gallery-card-image');
        const title = card.querySelector('h4');
        const subtitle = card.querySelector('span');
        
        const imageIndex = (galleryCurrentIndex + index) % galleryImages.length;
        imageDiv.style.backgroundImage = `url('${galleryImages[imageIndex]}')`;
        title.textContent = galleryTitles[imageIndex];
        subtitle.textContent = gallerySubtitles[imageIndex];
    });
}

// Gallery navigation event listeners
document.addEventListener('DOMContentLoaded', function() {
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            galleryCurrentIndex = (galleryCurrentIndex - 1 + galleryImages.length) % galleryImages.length;
            updateGalleryCards();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            galleryCurrentIndex = (galleryCurrentIndex + 1) % galleryImages.length;
            updateGalleryCards();
        });
    }
});

// =====================================================
// MOBILE GALLERY JAVASCRIPT
// =====================================================

let mobileGalleryActiveIndex = 0;
const mobileGalleryGroups = document.getElementsByClassName("mobile-gallery-group");

const handleMobileGalleryNextClick = () => {
    const nextIndex = mobileGalleryActiveIndex + 1 <= mobileGalleryGroups.length - 1 ? mobileGalleryActiveIndex + 1 : 0;

    const currentGroup = document.querySelector(`[data-index="${mobileGalleryActiveIndex}"]`),
        nextGroup = document.querySelector(`[data-index="${nextIndex}"]`);

    if (currentGroup && nextGroup) {
        currentGroup.dataset.status = "after";
        nextGroup.dataset.status = "becoming-active-from-before";

        setTimeout(() => {
            nextGroup.dataset.status = "active";
            mobileGalleryActiveIndex = nextIndex;
        });
    }
};

const handleMobileGalleryPrevClick = () => {
    const nextIndex = mobileGalleryActiveIndex - 1 >= 0 ? mobileGalleryActiveIndex - 1 : mobileGalleryGroups.length - 1;

    const currentGroup = document.querySelector(`[data-index="${mobileGalleryActiveIndex}"]`),
        nextGroup = document.querySelector(`[data-index="${nextIndex}"]`);

    if (currentGroup && nextGroup) {
        currentGroup.dataset.status = "before";
        nextGroup.dataset.status = "becoming-active-from-after";

        setTimeout(() => {
            nextGroup.dataset.status = "active";
            mobileGalleryActiveIndex = nextIndex;
        });
    }
};

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateGalleryCards();
});

// =====================================================
// PROFILE AND FEEDBACK SECTION JAVASCRIPT
// =====================================================

// =====================================================
// USER DATA MANAGEMENT SYSTEM
// =====================================================

// In-memory user data store (for session-based storage)
let currentUserData = {
    id: null,
    name: '',
    email: '',
    phone: '',
    joinDate: null,
    isLoggedIn: false,
    profileImage: null,
    preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
    },
    lastLogin: null,
    sessionToken: null
};

// User Data Manager Class
class UserDataManager {
    constructor() {
        this.userData = { ...currentUserData };
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.sessionTimer = null;
    }

    // Initialize user session
   initializeSession(userData) {
    this.userData = {
        ...this.userData,
        ...userData,
        isLoggedIn: true,
        lastLogin: new Date(),
        sessionToken: userData.sessionToken || null  // accept token from login data
    };
        this.startSessionTimer();
        this.updateUI();
        console.log('User session initialized:', this.userData);
        return this.userData;
    }

    // Update user profile
    updateProfile(updatedData) {
        const previousData = { ...this.userData };
        
        this.userData = {
            ...this.userData,
            ...updatedData
        };
        
        // Validate required fields
        if (!this.userData.name || !this.userData.email || !this.userData.phone) {
            this.userData = previousData; // Rollback
            throw new Error('Name, email, and phone are required fields');
        }
        
        // Validate email format
        if (!this.isValidEmail(this.userData.email)) {
            this.userData = previousData; // Rollback
            throw new Error('Please enter a valid email address');
        }
        
        this.updateUI();
        console.log('Profile updated:', this.userData);
        return this.userData;
    }

    // Get current user data
    getCurrentUser() {
        return this.userData;
    }

    // Check if user is logged in
    isAuthenticated() {
        return this.userData.isLoggedIn && this.userData.sessionToken;
    }

    // Logout user
    logout() {
        this.clearSession();
        this.updateUI();
        console.log('User logged out');
    }

    // Clear session data
    clearSession() {
        this.userData = { ...currentUserData };
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    // Start session timeout timer
    startSessionTimer() {
        if (this.sessionTimer) {
            clearTimeout(this.sessionTimer);
        }
        
        this.sessionTimer = setTimeout(() => {
            this.logout();
            showNotification('warning', 'Session Expired', 'You have been logged out due to inactivity.');
        }, this.sessionTimeout);
    }

    // Reset session timer (call on user activity)
    resetSessionTimer() {
        if (this.isAuthenticated()) {
            this.startSessionTimer();
        }
    }

    // Generate session token
   
    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Update UI with current user data
    updateUI() {
        if (!this.userData.isLoggedIn) {
            // Hide profile sections, show login
            this.hideProfileSections();
            return;
        }

        // Update profile name elements
        const profileNameElements = [
            document.getElementById('profileName'),
            document.getElementById('mobileProfileName')
        ];

        const joinDateElements = [
            document.getElementById('joinDate'),
            document.getElementById('mobileJoinDate')
        ];

        profileNameElements.forEach(el => {
            if (el) el.textContent = this.userData.name;
        });

        if (this.userData.joinDate) {
            const joinDateStr = new Date(this.userData.joinDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
            });

            joinDateElements.forEach(el => {
                if (el) el.textContent = `Member since ${joinDateStr}`;
            });
        }

        // Pre-fill form fields with current data
        this.populateFormFields();
    }

    // Populate form fields with current user data
    populateFormFields() {
        const forms = ['profileForm', 'mobileProfileForm'];
        
        forms.forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                const nameInput = form.querySelector('[name="fullName"]');
                const emailInput = form.querySelector('[name="email"]');
                const phoneInput = form.querySelector('[name="phone"]');

                if (nameInput) nameInput.value = this.userData.name || '';
                if (emailInput) emailInput.value = this.userData.email || '';
                if (phoneInput) phoneInput.value = this.userData.phone || '';
            }
        });
    }

    // Hide profile sections when not logged in
    hideProfileSections() {
        const elementsToHide = [
            'profileFormContainer',
            'mobileProfileFormContainer',
            'otpContainer',
            'mobileOtpContainer'
        ];

        elementsToHide.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }

    // Export user data (for backup/transfer)
    exportUserData() {
        return JSON.stringify(this.userData, null, 2);
    }

    // Import user data (for restore)
    importUserData(jsonData) {
        try {
            const importedData = JSON.parse(jsonData);
            this.initializeSession(importedData);
            return true;
        } catch (error) {
            console.error('Failed to import user data:', error);
            return false;
        }
    }
}

// Global user manager instance
const userManager = new UserDataManager();

// =====================================================
// MODIFIED PROFILE AND FEEDBACK SECTION JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", function() {
    
    // Initialize with sample user data (replace with actual login data)
    userManager.initializeSession({
        id: 'user_123',
        name: 'Anand Kumar',
        email: 'anand.kumar@example.com',
        phone: '+91 9876543210',
        joinDate: new Date('2024-06-15')
    });

    // Track user activity to reset session timer
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            userManager.resetSessionTimer();
        });
    });

    // STAR RATING SYSTEM (unchanged)
    const desktopStars = document.querySelectorAll('.star');
    let desktopRating = 0;
    
    if (desktopStars.length > 0) {
        desktopStars.forEach((star, index) => {
            star.addEventListener('click', () => {
                desktopRating = index + 1;
                updateStars(desktopStars, desktopRating);
            });
            
            star.addEventListener('mouseover', () => {
                updateStars(desktopStars, index + 1);
            });
        });
        
        document.getElementById('starRating')?.addEventListener('mouseleave', () => {
            updateStars(desktopStars, desktopRating);
        });
    }
    
    const mobileStars = document.querySelectorAll('.mobile-star');
    let mobileRating = 0;
    
    if (mobileStars.length > 0) {
        mobileStars.forEach((star, index) => {
            star.addEventListener('click', () => {
                mobileRating = index + 1;
                updateStars(mobileStars, mobileRating);
            });
            
            star.addEventListener('mouseover', () => {
                updateStars(mobileStars, index + 1);
            });
        });
        
        document.getElementById('mobileStarRating')?.addEventListener('mouseleave', () => {
            updateStars(mobileStars, mobileRating);
        });
    }
    
    function updateStars(stars, rating) {
        stars.forEach((star, i) => {
            star.classList.toggle('active', i < rating);
        });
    }
    
    // FEEDBACK FORM HANDLING (enhanced with user data)
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFeedbackSubmit(this, desktopRating);
        });
    }
    
    const mobileFeedbackForm = document.getElementById('mobileFeedbackForm');
    if (mobileFeedbackForm) {
        mobileFeedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFeedbackSubmit(this, mobileRating);
        });
    }
    
    function handleFeedbackSubmit(form, rating) {
        if (!userManager.isAuthenticated()) {
            showNotification('error', 'Authentication Required', 'Please log in to submit feedback.');
            return;
        }

        if (rating === 0) {
            showNotification('error', 'Rating Required', 'Please provide a rating before submitting.');
            return;
        }
        
        const formData = new FormData(form);
        const currentUser = userManager.getCurrentUser();
        
        const feedbackData = {
            userId: currentUser.id,
            userName: currentUser.name,
            userEmail: currentUser.email,
            rating: rating,
            overallReview: formData.get('overallReview'),
            thingsLiked: formData.get('thingsLiked'),
            improvements: formData.get('improvements'),
            timestamp: new Date().toISOString()
        };
        
        console.log('Feedback submitted:', feedbackData);
        showNotification('success', 'Feedback Submitted', 'Thank you for your valuable feedback!');
        
        form.reset();
        if (form.id === 'feedbackForm') {
            desktopRating = 0;
            updateStars(desktopStars, 0);
        } else {
            mobileRating = 0;
            updateStars(mobileStars, 0);
        }
    }
    
    // PROFILE FORM HANDLING (enhanced)
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileSubmit(this, false);
        });
    }
    
    const mobileProfileForm = document.getElementById('mobileProfileForm');
    if (mobileProfileForm) {
        mobileProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleProfileSubmit(this, true);
        });
    }
    
  function handleProfileSubmit(form, isMobile) {
    if (!userManager.isAuthenticated()) {
        showNotification('error', 'Authentication Required', 'Please log in to update your profile.');
        return;
    }

    const formData = new FormData(form);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    
    const updatedData = {
        name: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        // Validate and update profile
        userManager.updateProfile(updatedData);
        // Ensure navbar shows the updated user name everywhere
        const updatedUser = userManager.getCurrentUser();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUserDisplay();
    } catch (error) {
        showNotification('error', 'Update Failed', error.message);
        return;
    }
    
    if (newPassword && !currentPassword) {
        showNotification('error', 'Password Required', 'Please enter your current password to change it.');
        return;
    }
    
    const email = updatedData.email;
    if (isMobile) {
        document.getElementById('mobileProfileFormContainer').style.display = 'none';
        document.getElementById('mobileOtpContainer').classList.remove('hidden');
        document.getElementById('mobileEmailDisplay').textContent = email;
        startOTPTimer('mobileOtpTimer');
    } else {
        document.getElementById('profileFormContainer').style.display = 'none';
        document.getElementById('otpContainer').classList.remove('hidden');
        document.getElementById('emailDisplay').textContent = email;
        startOTPTimer('otpTimer');
    }
    
    showNotification('info', 'OTP Sent', `Verification code has been sent to ${email}`);
}

    
    // OTP SYSTEM (unchanged but enhanced logging)
    function startOTPTimer(timerElementId) {
        const timerElement = document.getElementById(timerElementId);
        if (!timerElement) return;
        
        let timeLeft = 180;
        updateTimerDisplay();
        
        const timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
            }
        }, 1000);
        
        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    function setupOTPInputs(containerSelector, inputSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        
        const inputs = container.querySelectorAll(inputSelector);
        
        inputs.forEach((input, index) => {
            input.addEventListener('input', function(e) {
                if (this.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    inputs[index - 1].focus();
                }
            });
            
            input.addEventListener('paste', function(e) {
                e.preventDefault();
                const paste = (e.clipboardData || window.clipboardData).getData('text');
                const pasteDigits = paste.replace(/\D/g, '').split('').slice(0, inputs.length);
                
                pasteDigits.forEach((digit, i) => {
                    if (inputs[i]) {
                        inputs[i].value = digit;
                    }
                });
                
                if (pasteDigits.length > 0) {
                    const lastIndex = Math.min(pasteDigits.length - 1, inputs.length - 1);
                    inputs[lastIndex].focus();
                }
            });
        });
    }
    
    // OTP Container Setup (unchanged)
    const desktopOtpContainer = document.getElementById('otpContainer');
    const mobileOtpContainer = document.getElementById('mobileOtpContainer');
    
    if (desktopOtpContainer) {
        setupOTPInputs('#otpContainer', '.otp-input');
        
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleOTPSubmit(this, false);
            });
        }
        
        document.getElementById('cancelOtp')?.addEventListener('click', function() {
            document.getElementById('otpContainer').classList.add('hidden');
            document.getElementById('profileFormContainer').style.display = 'block';
        });
        
        document.getElementById('resendOtp')?.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('emailDisplay').textContent;
            startOTPTimer('otpTimer');
            showNotification('info', 'OTP Resent', `New verification code has been sent to ${email}`);
        });
    }
    
    if (mobileOtpContainer) {
        setupOTPInputs('#mobileOtpContainer', '.mobile-otp-input');
        
        const mobileOtpForm = document.getElementById('mobileOtpForm');
        if (mobileOtpForm) {
            mobileOtpForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleOTPSubmit(this, true);
            });
        }
        
        document.getElementById('mobileOtpCancel')?.addEventListener('click', function() {
            document.getElementById('mobileOtpContainer').classList.add('hidden');
            document.getElementById('mobileProfileFormContainer').style.display = 'block';
        });
        
        document.getElementById('mobileResendOtp')?.addEventListener('click', function(e) {
            e.preventDefault();
            const email = document.getElementById('mobileEmailDisplay').textContent;
            startOTPTimer('mobileOtpTimer');
            showNotification('info', 'OTP Resent', `New verification code has been sent to ${email}`);
        });
    }
    
    function handleOTPSubmit(form, isMobile) {
        const inputs = form.querySelectorAll(isMobile ? '.mobile-otp-input' : '.otp-input');
        let otpValue = '';
        
        inputs.forEach(input => {
            otpValue += input.value;
        });
        
        if (otpValue.length !== 6) {
            showNotification('error', 'Invalid OTP', 'Please enter a complete 6-digit OTP code.');
            return;
        }
        
        const currentUser = userManager.getCurrentUser();
        console.log('OTP submitted for user:', currentUser.id, 'OTP:', otpValue);
        
        showNotification('success', 'Profile Updated', 'Your profile has been successfully updated!');
        
        setTimeout(() => {
            if (isMobile) {
                document.getElementById('mobileOtpContainer').classList.add('hidden');
                document.getElementById('mobileProfileFormContainer').style.display = 'block';
                document.getElementById('mobileProfileForm').reset();
            } else {
                document.getElementById('otpContainer').classList.add('hidden');
                document.getElementById('profileFormContainer').style.display = 'block';
                document.getElementById('profileForm').reset();
            }
            // Re-populate form fields with current user data
            userManager.populateFormFields();
        }, 2000);
    }

    // Add logout functionality
    window.logoutUser = function() {
        userManager.logout();
        showNotification('info', 'Logged Out', 'You have been successfully logged out.');
    };

    // Add function to get current user data (for debugging)
    window.getCurrentUserData = function() {
        return userManager.getCurrentUser();
    };
});
// =====================================================
// ANIMATED FEEDBACK CARDS
// =====================================================

document.addEventListener("DOMContentLoaded", function() {
    const desktopFeedbackCard = document.querySelector('.feedback-card-section');
    if (desktopFeedbackCard) {
        desktopFeedbackCard.innerHTML = `
            <div class="feedback-box">
                <div class="feedback-bg"></div>
                <div class="feedback-bird"></div>
            </div>
        `;
    }

    const mobileFeedbackCard = document.querySelector('.mobile-feedback-card');
    if (mobileFeedbackCard) {
        mobileFeedbackCard.innerHTML = `
            <div class="mobile-feedback-box">
                <div class="mobile-feedback-bg"></div>
                <div class="mobile-feedback-bird"></div>
            </div>
        `;
    }

    const style = document.createElement('style');
    style.textContent = `
        .feedback-box {
            position: relative;
            width: 100%;
            height: 25rem;
            cursor: pointer;
        }

        .feedback-bg {
            width: 100%;
            height: 100%;
            position: absolute;
            background-image: url("https://static.vecteezy.com/system/resources/previews/066/434/330/non_2x/feedback-suggestion-box-illustration-flat-design-of-comment-box-with-note-paper-and-pen-giving-opinion-review-suggestion-for-ui-customer-service-survey-form-testimonial-section-and-feedback-vector.jpg");
            background-size: cover;
            background-position: center;
            transition: 1s;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 102, 204, 0.2);
        }

        .feedback-box:hover .feedback-bg {
            transform: perspective(20px) rotateX(2deg) translateY(-50px);
        }

        .feedback-bird {
            position: absolute;
            width: 100%;
            height: 20rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            animation: feedbackAnimation 1s linear infinite;
            animation-play-state: paused;
            transition: 1s;
            bottom: 0;
            left: 0;
        }

        .feedback-box:hover .feedback-bird {
            animation-play-state: running;
            transform: translateY(-180px) translateX(-10px);
        }

        .mobile-feedback-box {
            position: relative;
            width: 100%;
            height: 20rem;
            cursor: pointer;
            margin-top: 20px;
        }

        .mobile-feedback-bg {
            width: 100%;
            height: 300px;
            position: absolute;
            background-image: url("https://static.vecteezy.com/system/resources/previews/066/434/330/non_2x/feedback-suggestion-box-illustration-flat-design-of-comment-box-with-note-paper-and-pen-giving-opinion-review-suggestion-for-ui-customer-service-survey-form-testimonial-section-and-feedback-vector.jpg");
            background-size: cover;
            background-position: center;
            transition: 1s;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 102, 204, 0.2);
        }

        .mobile-feedback-box:hover .mobile-feedback-bg {
            transform: perspective(10px) rotateX(1deg) translateY(-30px);
        }

        .mobile-feedback-bird {
            position: absolute;
            width: 100%;
            height: 15rem;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            animation: feedbackAnimation 1s steps(5) infinite;
            animation-play-state: paused;
            transition: 1s;
            bottom: 0;
            left: 0;
        }

        .mobile-feedback-box:hover .mobile-feedback-bird {
            animation-play-state: running;
            transform: translateY(-120px) translateX(-5px);
        }

        @keyframes feedbackAnimation {
            from {
                background-image: url("../assets/images/1-star.png");
            }
            to {
                background-image: url("../assets/images/5-star.png");
            }
        }

        @media (max-width: 768px) {
            .feedback-box {
                height: 20rem;
            }
            
            .feedback-bird {
                height: 15rem;
            }
            
            .feedback-box:hover .feedback-bird {
                transform: translateY(-120px) translateX(-5px);
            }
        }

        @media (max-width: 480px) {
            .mobile-feedback-box {
                height: 18rem;
            }
            
            .mobile-feedback-bird {
                height: 14rem;
            }
            
            .mobile-feedback-box:hover .mobile-feedback-bird {
                transform: translateY(-100px) translateX(-5px);
            }
        }
    `;
    document.head.appendChild(style);
});

// =====================================================
// TEST RIDE BOOKING SYSTEM
// =====================================================

document.addEventListener("DOMContentLoaded", function() {
      // =====================================================
    // TEST RIDE BOOKING SYSTEM - Updated with JWT Authorization Header
    // =====================================================

    const bikeData = [
        {
            name: "Avenis",
            image: "https://imgd.aeplcdn.com/1280x720/n/lbuk7fb_1822917.jpg?q=100"
        },
        {
            name: "Burgman Street",
            image: "https://cdn.suzukimotorcycle.co.in/public-live/uploads/color-images/original/burgman_ride_connect_metallic_matte_titanium_silver.jpg"
        },
        {
            name: "Burgman Street 125 EX",
            image: "https://cdn.suzukimotorcycle.co.in/public-live/uploads/color-images/original/burgman-ex-metallic-matte-stellar-blue.jpg"
        },
        {
            name: "Gixxer SF 150",
            image: "https://cdn.suzukimotorcycle.co.in/public-live/uploads/color-images/original/Gixxer-sfMet-Triton-Blue-Pearl-Glacier-White.jpg"
        },
        {
            name: "V-Strom 250",
            image: "https://www.rydersarena.in/cdn/shop/collections/Suzuki_V-Strom_SX.jpg?v=1718819925"
        },
        {
            name: "Access 125 Standard",
            image: "https://cdn.bikedekho.com/processedimages/suzuki/2025-access-125/640X309/2025-access-125687a260fc5f14.jpg?imwidth=360&impolicy=resize"
        },
        {
            name: "Access 125 Special Edition",
            image: "https://imgd.aeplcdn.com/1056x594/n/i2tsjfb_1820545.jpeg?q=80"
        },
        {
            name: "Access 125 Ride Connect Edition",
            image: "https://imgd.aeplcdn.com/1056x594/n/i2tsjfb_1820545.jpeg?q=80"
        },
        {
            name: "Access 125 Ride Connect TFT Edition",
            image: "https://cdn.bikedekho.com/processedimages/suzuki/2025-access-125/source/2025-access-12568314f20a5158.jpg?imwidth=408&impolicy=resize"
        }
    ];

    let selectedBike = null;

    function initializeBikeGrids() {
        const desktopGrid = document.getElementById('bikeGrid');
        const mobileGrid = document.getElementById('mobileBikeGrid');

        if (desktopGrid) {
            populateBikeGrid(desktopGrid, 'bike-card', false);
        }
        if (mobileGrid) {
            populateBikeGrid(mobileGrid, 'mobile-bike-card', true);
        }
    }

    function populateBikeGrid(container, cardClass, isMobile) {
        container.innerHTML = '';

        bikeData.forEach((bike, index) => {
            const bikeCard = document.createElement('div');
            bikeCard.className = cardClass;
            bikeCard.dataset.bikeIndex = index;

            bikeCard.innerHTML = `
                <img src="${bike.image}" alt="${bike.name}" class="${isMobile ? 'mobile-bike-image' : 'bike-image'}" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNHB4IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg=='">
                <div class="${isMobile ? 'mobile-bike-name' : 'bike-name'}">${bike.name}</div>
            `;

            bikeCard.addEventListener('click', () => selectBike(index, isMobile));
            container.appendChild(bikeCard);
        });
    }

    function selectBike(index, isMobile) {
        selectedBike = bikeData[index];

        const cards = document.querySelectorAll(isMobile ? '.mobile-bike-card' : '.bike-card');
        cards.forEach(card => card.classList.remove('selected'));
        cards[index].classList.add('selected');

        const displayElement = document.getElementById(isMobile ? 'mobileSelectedBike' : 'selectedBikeDisplay');
        if (displayElement) {
            displayElement.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Selected: ${selectedBike.name}</span>
            `;
        }
    }

    function setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInputs = document.querySelectorAll('#testRideDate, #mobileTestRideDate');
        dateInputs.forEach(input => {
            if (input) input.min = today;
        });
    }

    function showNotification(type, title, message, duration = 5000) {
        let container = document.getElementById("notification-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "notification-container";
            container.style.position = "fixed";
            container.style.top = "20px";
            container.style.right = "20px";
            container.style.zIndex = "9999";
            container.style.maxWidth = "320px";
            document.body.appendChild(container);
        }

        const notification = document.createElement("div");
        notification.style.background =
            type === "success" ? "#28a745" :
            type === "error" ? "#dc3545" :
            type === "warning" ? "#ffc107" :
            "#17a2b8";
        notification.style.color = "white";
        notification.style.padding = "12px 20px";
        notification.style.marginTop = "12px";
        notification.style.borderRadius = "6px";
        notification.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        notification.style.fontFamily = "Arial, sans-serif";
        notification.style.cursor = "pointer";
        notification.style.opacity = "0";
        notification.style.transition = "opacity 0.3s ease";

        notification.innerHTML = `
            <strong style="display:block; margin-bottom:5px;">${title}</strong>
            <span>${message}</span>
        `;

        notification.addEventListener("click", () => {
            container.removeChild(notification);
        });

        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "1";
        }, 10);

        setTimeout(() => {
            if (container.contains(notification)) {
                notification.style.opacity = "0";
                setTimeout(() => {
                    if (container.contains(notification)) container.removeChild(notification);
                }, 300);
            }
        }, duration);
    }

    function handleFormSubmit(form, isMobile) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!selectedBike) {
                showNotification('error', 'Selection Required', 'Please select a motorcycle model first.');
                return;
            }

            const formData = new FormData(form);
            const bookingData = {
                bike: selectedBike.name,
                testRideDate: formData.get('testRideDate'),
                testRideTime: formData.get('testRideTime'),
                customerAddress: formData.get('customerAddress')
            };

            // Validate date is not in the past
            const selectedDate = new Date(bookingData.testRideDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
                showNotification('error', 'Invalid Date', 'Please select a future date for your test ride.');
                return;
            }

            try {
                // Get JWT token from user session
                const currentUser  = userManager.getCurrentUser ();
                const token = currentUser  ? currentUser .sessionToken : null;
                if (!token) {
                    showNotification('error', 'Authentication Required', 'Please log in to book a test ride.');
                    return;
                }

                // Send booking data to backend API with Authorization header
                const response = await fetch('/api/test-ride', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookingData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    showNotification(
                        'success',
                        'Booking Confirmed!',
                        `Thank you for booking a test ride for ${selectedBike.name}. Our team will contact you shortly.`
                    );

                    setTimeout(() => {
                        form.reset();
                        selectedBike = null;

                        const cards = document.querySelectorAll(isMobile ? '.mobile-bike-card' : '.bike-card');
                        cards.forEach(card => card.classList.remove('selected'));

                        const displayElement = document.getElementById(isMobile ? 'mobileSelectedBike' : 'selectedBikeDisplay');
                        if (displayElement) {
                            displayElement.innerHTML = `
                                <i class="fas fa-info-circle"></i>
                                <span>${isMobile ? 'Select a motorcycle model' : 'Please select a motorcycle model'}</span>
                            `;
                        }
                    }, 3000);
                } else {
                    showNotification('error', 'Booking Failed', result.message || 'Please try again later.');
                }
            } catch (error) {
                console.error('Booking submission error:', error);
                showNotification('error', 'Server Error', 'Could not submit your booking at this time.');
            }
        });
    }

    initializeBikeGrids();
    setMinDate();

    const desktopForm = document.getElementById('testRideForm');
    const mobileForm = document.getElementById('mobileTestRideForm');

    if (desktopForm) handleFormSubmit(desktopForm, false);
    if (mobileForm) handleFormSubmit(mobileForm, true);

});
// =====================================================
// QUOTATION SYSTEM - Complete Isolated System
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    const QuotationSystem = {
        data: {
            'suzuki-access-125': {
                name: 'Suzuki Access 125',
                variants: {
                    'basic-drum-brake': {
                        name: 'Basic Variant (Drum Brake)',
                        colors: [
                            { value: 'white', name: 'White' },
                            { value: 'black', name: 'Black' },
                            { value: 'matte-blue', name: 'Matte Blue' }
                        ]
                    },
                    'mid-disc-brake': {
                        name: 'Mid Variant (Disc Brake)',
                        colors: [
                            { value: 'white', name: 'White' },
                            { value: 'black', name: 'Black' },
                            { value: 'matte-blue', name: 'Matte Blue' },
                            { value: 'ice-green', name: 'Ice Green' }
                        ]
                    },
                    'high-disc-bluetooth': {
                        name: 'High Variant (Disc Brake + Bluetooth)',
                        colors: [
                            { value: 'white', name: 'White' },
                            { value: 'black', name: 'Black' },
                            { value: 'matte-blue', name: 'Matte Blue' },
                            { value: 'ice-green', name: 'Ice Green' }
                        ]
                    }
                }
            },
            'suzuki-burgman-street': {
                name: 'Suzuki Burgman Street',
                variants: {
                    'bluetooth-variant': {
                        name: 'Bluetooth Variant',
                        colors: [
                            { value: 'pearl-mirage-white', name: 'Pearl Mirage White' },
                            { value: 'metallic-matte-titanium-silver', name: 'Metallic Matte Titanium Silver' },
                            { value: 'metallic-matte-black-no-2', name: 'Metallic Matte Black No. 2' },
                            { value: 'pearl-matte-shadow', name: 'Pearl Matte Shadow' }
                        ]
                    },
                    'ex-variant': {
                        name: 'EX Variant',
                        colors: [
                            { value: 'metallic-matte-black', name: 'Metallic Matte Black' },
                            { value: 'metallic-matte-platinum-silver', name: 'Metallic Matte Platinum Silver' },
                            { value: 'royal-bronze', name: 'Royal Bronze' }
                        ]
                    }
                }
            },
            'suzuki-avenis': {
                name: 'Suzuki Avenis',
                variants: {
                    'standard': {
                        name: 'Standard',
                        colors: [
                            { value: 'glossy-sparkle-black-pearl-mira-red', name: 'Glossy Sparkle Black / Pearl Mira Red' },
                            { value: 'glossy-sparkle-black-pearl-glacier-white', name: 'Glossy Sparkle Black / Pearl Glacier White' },
                            { value: 'champion-yellow-no-2-glossy-sparkle-black', name: 'Champion Yellow No 2 / Glossy Sparkle Black' },
                            { value: 'glossy-sparkle-black', name: 'Glossy Sparkle Black' }
                        ]
                    },
                    'special-edition': {
                        name: 'Special Edition',
                        colors: [
                            { value: 'metallic-matte-black-no-2-matte-titanium-silver', name: 'Metallic Matte Black No. 2 / Matte Titanium Silver' }
                        ]
                    }
                }
            },
            'suzuki-gixxer-150': {
                name: 'Suzuki Gixxer 150',
                variants: {
                    'gixxer-naked': {
                        name: 'Gixxer (Naked)',
                        colors: [
                            { value: 'metallic-sonic-silver-pearl-blaze-orange', name: 'Metallic Sonic Silver/Pearl Blaze Orange' },
                            { value: 'metallic-matte-triton-blue', name: 'Metallic Matte Triton Blue' },
                            { value: 'glass-sparkle-black', name: 'Glass Sparkle Black' }
                        ]
                    },
                    'gixxer-sf-150': {
                        name: 'Gixxer SF (150)',
                        colors: [
                            { value: 'glass-sparkle-black', name: 'Glass Sparkle Black' },
                            { value: 'metallic-triton-blue', name: 'Metallic Triton Blue' },
                            { value: 'metallic-oort-gray-metallic-lush-green', name: 'Metallic Oort Gray/Metallic Lush Green' }
                        ]
                    }
                }
            },
            'suzuki-vstrom-sx-250': {
                name: 'Suzuki V-Strom Sx (250)',
                variants: {
                    'standard': {
                        name: 'Standard',
                        colors: [
                            { value: 'black', name: 'Black' },
                            { value: 'yellow', name: 'Yellow' }
                        ]
                    }
                }
            }
        },

        colorMappings: {
            "white": "#FFFFFF",
            "black": "#000000",
            "matte-blue": "#2E4A7A",
            "ice-green": "#40E0D0",
            "pearl-mirage-white": "#F8F8FF",
            "metallic-matte-titanium-silver": "#C0C0C0",
            "metallic-matte-black-no-2": "#1C1C1C",
            "pearl-matte-shadow": "#36454F",
            "metallic-matte-black": "#2F2F2F",
            "metallic-matte-platinum-silver": "#E5E4E2",
            "royal-bronze": "#CD7F32",
            "glossy-sparkle-black-pearl-mira-red": "linear-gradient(45deg, #000000, #DC143C)",
            "glossy-sparkle-black-pearl-glacier-white": "linear-gradient(45deg, #000000, #F0F8FF)",
            "champion-yellow-no-2-glossy-sparkle-black": "linear-gradient(45deg, #FFD700, #000000)",
            "glossy-sparkle-black": "#000000",
            "metallic-matte-black-no-2-matte-titanium-silver": "linear-gradient(45deg, #1C1C1C, #C0C0C0)",
            "metallic-sonic-silver-pearl-blaze-orange": "linear-gradient(45deg, #C0C0C0, #FF6347)",
            "metallic-matte-triton-blue": "#4682B4",
            "glass-sparkle-black": "#000000",
            "metallic-triton-blue": "#4682B4",
            "metallic-oort-gray-metallic-lush-green": "linear-gradient(45deg, #708090, #228B22)",
            "yellow": "#FFFF00"
        },

        state: {
            model: null,
            variant: null,
            color: null,
            insurance: null
        },

        init() {
            this.setupDateFields();
            this.setupCustomSelects();
            this.setupInsuranceSelection();
            this.setupFormSubmission();
            this.setupOutsideClickHandler();
        },

        setupDateFields() {
            const today = new Date().toISOString().split('T')[0];
            const quotationOrderDate = document.getElementById('quotationOrderDate');
            const mobileQuotationOrderDate = document.getElementById('mobileQuotationOrderDate');
            if (quotationOrderDate) quotationOrderDate.value = today;
            if (mobileQuotationOrderDate) mobileQuotationOrderDate.value = today;
        },

        setupCustomSelects() {
            const quotationModelSelect = document.getElementById('quotationModelSelect');
            this.setupCustomSelect(quotationModelSelect, (value, text) => {
                this.state.model = { value: value, name: text };
                this.populateVariants(value, false);
                this.updateSummary(false);
            });

            const quotationVariantSelect = document.getElementById('quotationVariantSelect');
            this.setupCustomSelect(quotationVariantSelect, (value, text) => {
                this.state.variant = { value: value, name: text };
                this.populateColors(this.state.model.value, value, false);
                this.updateSummary(false);
            });

            const mobileQuotationModelSelect = document.getElementById('mobileQuotationModelSelect');
            this.setupCustomSelect(mobileQuotationModelSelect, (value, text) => {
                this.state.model = { value: value, name: text };
                this.populateVariants(value, true);
                this.updateSummary(true);
            });

            const mobileQuotationVariantSelect = document.getElementById('mobileQuotationVariantSelect');
            this.setupCustomSelect(mobileQuotationVariantSelect, (value, text) => {
                this.state.variant = { value: value, name: text };
                this.populateColors(this.state.model.value, value, true);
                this.updateSummary(true);
            });
        },

        setupCustomSelect(selectElement, onSelect) {
            if (!selectElement) return;
            
            const trigger = selectElement.querySelector('.select-trigger, .mobile-select-trigger');
            const options = selectElement.querySelector('.select-options, .mobile-select-options');
            const textElement = selectElement.querySelector('.select-text, .mobile-select-text');
            
            if (!trigger || !options || !textElement) return;

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeAllSelects();
                selectElement.classList.toggle('active');
            });

            options.addEventListener('click', (e) => {
                e.stopPropagation();
                const option = e.target.closest('.select-option, .mobile-select-option');
                if (option) {
                    const value = option.getAttribute('data-value');
                    const text = option.textContent;
                    
                    textElement.textContent = text;
                    selectElement.classList.remove('active');
                    
                    if (onSelect) {
                        onSelect(value, text);
                    }
                }
            });
        },

        closeAllSelects() {
            document.querySelectorAll('#quotationSection .custom-select, #quotationSection .mobile-custom-select').forEach(select => {
                select.classList.remove('active');
            });
            document.querySelectorAll('#mobileQuotationSection .custom-select, #mobileQuotationSection .mobile-custom-select').forEach(select => {
                select.classList.remove('active');
            });
        },

        populateVariants(modelKey, isMobile = false) {
            const model = this.data[modelKey];
            if (!model) return;

            const variantOptions = isMobile ? 
                document.getElementById('mobileQuotationVariantOptions') : 
                document.getElementById('quotationVariantOptions');
            const variantSection = isMobile ? 
                document.getElementById('mobileQuotationVariantSection') : 
                document.getElementById('quotationVariantSection');

            if (!variantOptions || !variantSection) return;

            variantOptions.innerHTML = '';

            Object.entries(model.variants).forEach(([key, variant]) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = isMobile ? 'mobile-select-option' : 'select-option';
                optionDiv.setAttribute('data-value', key);
                optionDiv.textContent = variant.name;
                variantOptions.appendChild(optionDiv);
            });

            variantSection.style.display = 'block';
        },

        populateColors(modelKey, variantKey, isMobile = false) {
            const variant = this.data[modelKey]?.variants[variantKey];
            if (!variant) return;

            const colorGrid = isMobile ? 
                document.getElementById('mobileQuotationColorGrid') : 
                document.getElementById('quotationColorGrid');
            const colorSection = isMobile ? 
                document.getElementById('mobileQuotationColorSection') : 
                document.getElementById('quotationColorSection');

            if (!colorGrid || !colorSection) return;

            colorGrid.innerHTML = '';

            variant.colors.forEach(color => {
                const colorCard = document.createElement('div');
                colorCard.className = isMobile ? 'mobile-color-card' : 'color-card';
                colorCard.setAttribute('data-value', color.value);
                
                const colorPreview = document.createElement('div');
                colorPreview.className = isMobile ? 'mobile-color-preview' : 'color-preview';
                
                const colorValue = this.colorMappings[color.value] || '#CCCCCC';
                if (colorValue.includes('gradient')) {
                    colorPreview.style.background = colorValue;
                } else {
                    colorPreview.style.backgroundColor = colorValue;
                }
                
                const colorName = document.createElement('div');
                colorName.className = isMobile ? 'mobile-color-name' : 'color-name';
                colorName.textContent = color.name;
                
                colorCard.appendChild(colorPreview);
                colorCard.appendChild(colorName);

                colorCard.addEventListener('click', (e) => {
                    e.stopPropagation();
                    colorGrid.querySelectorAll(`.${isMobile ? 'mobile-color-card' : 'color-card'}`).forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    colorCard.classList.add('selected');
                    
                    this.state.color = {
                        value: color.value,
                        name: color.name
                    };

                    const insuranceSection = isMobile ? 
                        document.getElementById('mobileQuotationInsuranceSection') : 
                        document.getElementById('quotationInsuranceSection');
                    if (insuranceSection) {
                        insuranceSection.style.display = 'block';
                    }

                    this.updateSummary(isMobile);
                });

                colorGrid.appendChild(colorCard);
            });

            colorSection.style.display = 'block';
        },

        setupInsuranceSelection() {
            const insuranceCards = document.querySelectorAll('#quotationSection .insurance-card');
            insuranceCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    insuranceCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    
                    this.state.insurance = {
                        value: card.getAttribute('data-value'),
                        name: card.getAttribute('data-value') === 'with' ? 'With Insurance' : 'Without Insurance'
                    };

                    this.updateSummary(false);
                    this.showSubmitSection(false);
                });
            });

            const mobileInsuranceCards = document.querySelectorAll('#mobileQuotationSection .mobile-insurance-card');
            mobileInsuranceCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mobileInsuranceCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    
                    this.state.insurance = {
                        value: card.getAttribute('data-value'),
                        name: card.getAttribute('data-value') === 'with' ? 'With Insurance' : 'Without Insurance'
                    };

                    this.updateSummary(true);
                    this.showSubmitSection(true);
                });
            });
        },

        showSubmitSection(isMobile) {
            const submitSection = isMobile ? 
                document.getElementById('mobileQuotationSubmit') : 
                document.getElementById('quotationSubmit');
            if (submitSection) {
                submitSection.style.display = 'block';
            }
        },

        updateSummary(isMobile = false) {
            const prefix = isMobile ? 'mobileQuotation' : 'quotation';
            
            const summaryModel = document.getElementById(`${prefix}SummaryModel`);
            const summaryVariant = document.getElementById(`${prefix}SummaryVariant`);
            const summaryColor = document.getElementById(`${prefix}SummaryColor`);
            const summaryInsurance = document.getElementById(`${prefix}SummaryInsurance`);
            const summaryDate = document.getElementById(`${prefix}SummaryDate`);
            const orderSummary = document.getElementById(`${prefix}OrderSummary`);

            if (this.state.model) {
                if (summaryModel) summaryModel.textContent = this.state.model.name;
            }
            if (this.state.variant) {
                if (summaryVariant) summaryVariant.textContent = this.state.variant.name;
            }
            if (this.state.color) {
                if (summaryColor) summaryColor.textContent = this.state.color.name;
            }
            if (this.state.insurance) {
                if (summaryInsurance) summaryInsurance.textContent = this.state.insurance.name;
            }
            
            const today = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            if (summaryDate) summaryDate.textContent = today;

            if (this.state.model && this.state.variant && this.state.color && this.state.insurance) {
                if (orderSummary) orderSummary.style.display = 'block';
            }
        },

        setupFormSubmission() {
  const submitBtn = document.getElementById('submitQuotationRequest');
  const mobileSubmitBtn = document.getElementById('mobileSubmitQuotationRequest');

  const handleSubmit = async (isMobile = false, event) => {
    if (event) event.preventDefault(); // Prevent default form/button submission

    console.log("Submit button clicked", { 
      model: this.state.model, 
      variant: this.state.variant,
      color: this.state.color,
      insurance: this.state.insurance
    });

    if (!this.state.model || !this.state.variant || 
        !this.state.color || !this.state.insurance) {
      showNotification('error', 'Incomplete Selection', 'Please complete all selections before requesting a quotation.');
      return;
    }

    // Get token from current user session
    const currentUser = userManager.getCurrentUser();
    const token = currentUser ? currentUser.sessionToken : null;
    if (!token) {
      showNotification('error', 'Authentication Required', 'Please log in again.');
      return;
    }

    const quotationRequest = {
      model: this.state.model.value,
      variant: this.state.variant.value,
      color: this.state.color.value,
      insurance: this.state.insurance.value,
      orderDate: new Date().toISOString()
    };

    try {
      showNotification('info', 'Submitting...', 'Your quotation request is being sent...');

      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quotationRequest)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showNotification(
          'success',
          'Quotation Requested Successfully',
          result.message || 'Thank you for your interest! Our sales team will contact you shortly.'
        );
        setTimeout(() => {
          this.resetForm(isMobile);
        }, 2000);
      } else {
        console.warn("Submission failed:", result);
        showNotification('error', 'Submission Failed', result.message || 'There was a problem. Please try again.');
      }
    } catch (error) {
      console.error("Error submitting quotation:", error);
      showNotification('error', 'Server Error', 'Could not process request. Please try again later.');
    }
  };

  if (submitBtn) {
    submitBtn.setAttribute('type', 'button'); // Ensure button doesn't submit form directly
    submitBtn.addEventListener('click', (event) => handleSubmit(false, event));
  }
  if (mobileSubmitBtn) {
    mobileSubmitBtn.setAttribute('type', 'button');
    mobileSubmitBtn.addEventListener('click', (event) => handleSubmit(true, event));
  }
},


        resetForm(isMobile = false) {
            const prefix = isMobile ? 'mobile' : '';
            
            this.state = {
                model: null,
                variant: null,
                color: null,
                insurance: null
            };

            const modelTrigger = document.querySelector(`#${prefix}QuotationModelSelect .${isMobile ? 'mobile-select-text' : 'select-text'}`);
            const variantTrigger = document.querySelector(`#${prefix}QuotationVariantSelect .${isMobile ? 'mobile-select-text' : 'select-text'}`);
            
            if (modelTrigger) modelTrigger.textContent = 'Choose your preferred model';
            if (variantTrigger) variantTrigger.textContent = 'Choose variant';

            const sections = [
                `${prefix}QuotationVariantSection`,
                `${prefix}QuotationColorSection`,
                `${prefix}QuotationInsuranceSection`,
                `${prefix}QuotationOrderSummary`,
                `${prefix}QuotationSubmit`
            ];

            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) section.style.display = 'none';
            });

            document.querySelectorAll('#quotationSection .insurance-card.selected, #mobileQuotationSection .mobile-insurance-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            document.querySelectorAll('#quotationSection .color-card.selected, #mobileQuotationSection .mobile-color-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
        },

        setupOutsideClickHandler() {
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#quotationSection') && !e.target.closest('#mobileQuotationSection')) {
                    this.closeAllSelects();
                }
            });
        }
    };

    // =====================================================
    // BOOKING SYSTEM - Complete Isolated System
    // =====================================================

    const BookingSystem = {
        bikeConfig: {
            access125: {
                name: "Suzuki Access 125",
                variants: {
                    basic: {
                        name: "Basic Variant (Drum Brake)",
                        colors: ["White", "Black", "Matte Blue"]
                    },
                    mid: {
                        name: "Mid Variant (Disc Brake)",
                        colors: ["White", "Black", "Matte Blue", "Ice Green"]
                    },
                    high: {
                        name: "High Variant (Disc Brake + Bluetooth)",
                        colors: ["White", "Black", "Matte Blue", "Ice Green"]
                    }
                }
            },
            burgman: {
                name: "Suzuki Burgman Street",
                variants: {
                    bluetooth: {
                        name: "Bluetooth Variant",
                        colors: ["Pearl Mirage White", "Metallic Matte Titanium Silver", "Metallic Matte Black No. 2", "Pearl Matte Shadow"]
                    },
                    ex: {
                        name: "EX Variant",
                        colors: ["Metallic Matte Black", "Metallic Matte Platinum Silver", "Royal Bronze"]
                    }
                }
            },
            avenis: {
                name: "Suzuki Avenis",
                variants: {
                    standard: {
                        name: "Standard Edition",
                        colors: ["Glossy Sparkle Black / Pearl Mira Red", "Glossy Sparkle Black / Pearl Glacier White", "Champion Yellow No 2 / Glossy Sparkle Black", "Glossy Sparkle Black"]
                    },
                    special: {
                        name: "Special Edition",
                        colors: ["Metallic Matte Black No. 2 / Matte Titanium Silver"]
                    }
                }
            },
            gixxer: {
                name: "Suzuki Gixxer 150",
                variants: {
                    naked: {
                        name: "Gixxer (Naked)",
                        colors: ["Metallic Sonic Silver/Pearl Blaze Orange", "Metallic Matte Triton Blue", "Glass Sparkle Black"]
                    },
                    sf: {
                        name: "Gixxer SF (150)",
                        colors: ["Glass Sparkle Black", "Metallic Triton Blue", "Metallic Oort Gray/Metallic Lush Green"]
                    }
                }
            },
            vstrom: {
                name: "Suzuki V-Strom SX (250)",
                variants: {
                    standard: {
                        name: "Standard",
                        colors: ["Black", "Yellow"]
                    }
                }
            }
        },

        colorMappings: {
            "White": "#FFFFFF",
            "Black": "#000000",
            "Matte Blue": "#2E4A7A",
            "Ice Green": "#40E0D0",
            "Pearl Mirage White": "#F8F8FF",
            "Metallic Matte Titanium Silver": "#C0C0C0",
            "Metallic Matte Black No. 2": "#1C1C1C",
            "Pearl Matte Shadow": "#36454F",
            "Metallic Matte Black": "#2F2F2F",
            "Metallic Matte Platinum Silver": "#E5E4E2",
            "Royal Bronze": "#CD7F32",
            "Glossy Sparkle Black / Pearl Mira Red": "linear-gradient(45deg, #000000, #DC143C)",
            "Glossy Sparkle Black / Pearl Glacier White": "linear-gradient(45deg, #000000, #F0F8FF)",
            "Champion Yellow No 2 / Glossy Sparkle Black": "linear-gradient(45deg, #FFD700, #000000)",
            "Glossy Sparkle Black": "#000000",
            "Metallic Matte Black No. 2 / Matte Titanium Silver": "linear-gradient(45deg, #1C1C1C, #C0C0C0)",
            "Metallic Sonic Silver/Pearl Blaze Orange": "linear-gradient(45deg, #C0C0C0, #FF6347)",
            "Metallic Matte Triton Blue": "#4682B4",
            "Glass Sparkle Black": "#000000",
            "Metallic Triton Blue": "#4682B4",
            "Metallic Oort Gray/Metallic Lush Green": "linear-gradient(45deg, #708090, #228B22)",
            "Yellow": "#FFFF00"
        },

        bookingState: {
            selectedModel: null,
            selectedVariant: null,
            selectedColor: null,
            selectedHelmet: null,
            selectedSeat: 'default',
            deliveryDate: null,
            insurance: false,
            additionalNotes: '',
            isMobile: false
        },

        init() {
            this.setupCustomSelects();
            this.setupEventListeners();
            this.setMinimumDeliveryDate();
        },

        setupCustomSelects() {
            this.setupSelect('modelSelect', this.handleModelSelect.bind(this), false);
            this.setupSelect('variantSelect', this.handleVariantSelect.bind(this), false);
            this.setupSelect('mobileModelSelect', this.handleModelSelect.bind(this), true);
            this.setupSelect('mobileVariantSelect', this.handleVariantSelect.bind(this), true);
        },

        setupSelect(selectId, handler, isMobile) {
            const selectElement = document.getElementById(selectId);
            if (!selectElement) return;

            const trigger = selectElement.querySelector(isMobile ? '.mobile-select-trigger' : '.select-trigger');
            const options = selectElement.querySelector(isMobile ? '.mobile-select-options' : '.select-options');

            if (trigger && options) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.closeAllBookingSelects();
                    selectElement.classList.toggle('active');
                });

                options.addEventListener('click', (e) => {
                    const option = e.target.closest(isMobile ? '.mobile-select-option' : '.select-option');
                    if (option) {
                        const value = option.getAttribute('data-value');
                        const text = option.textContent;
                        
                        const textElement = trigger.querySelector(isMobile ? '.mobile-select-text' : '.select-text');
                        if (textElement) {
                            textElement.textContent = text;
                        }
                        
                        selectElement.classList.remove('active');
                        handler(value, isMobile);
                    }
                });
            }
        },

        closeAllBookingSelects() {
            document.querySelectorAll('#bookingSection .custom-select, #bookingSection .mobile-custom-select').forEach(select => {
                select.classList.remove('active');
            });
            document.querySelectorAll('#mobileBookingSection .custom-select, #mobileBookingSection .mobile-custom-select').forEach(select => {
                select.classList.remove('active');
            });
        },

        handleModelSelect(modelKey, isMobile) {
            this.bookingState.selectedModel = modelKey;
            this.bookingState.selectedVariant = null;
            this.bookingState.selectedColor = null;
            this.bookingState.isMobile = isMobile;

            this.populateBookingVariants(modelKey, isMobile);
            
            const variantSection = document.getElementById(isMobile ? 'mobileVariantSection' : 'variantSection');
            if (variantSection) {
                variantSection.style.display = 'block';
                setTimeout(() => variantSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
            }

            this.hideSubsequentSections('variant', isMobile);
            this.updateBookingOrderSummary();
        },

        handleVariantSelect(variantKey, isMobile) {
            this.bookingState.selectedVariant = variantKey;
            this.bookingState.selectedColor = null;

            this.populateBookingColors(this.bookingState.selectedModel, variantKey, isMobile);
            
            const colorSection = document.getElementById(isMobile ? 'mobileColorSection' : 'colorSection');
            if (colorSection) {
                colorSection.style.display = 'block';
                setTimeout(() => colorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
            }

            this.hideSubsequentSections('color', isMobile);
            this.updateBookingOrderSummary();
        },

        handleColorSelect(color, isMobile) {
            this.bookingState.selectedColor = color;

            const helmetSection = document.getElementById(isMobile ? 'mobileHelmetSection' : 'helmetSection');
            if (helmetSection) {
                helmetSection.style.display = 'block';
                setTimeout(() => helmetSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
            }

            this.hideSubsequentSections('helmet', isMobile);
            this.updateBookingOrderSummary();
        },

        populateBookingVariants(modelKey, isMobile) {
            const variants = this.bikeConfig[modelKey]?.variants;
            if (!variants) return;

            const optionsContainer = document.querySelector(
                `#${isMobile ? 'mobileVariantSelect' : 'variantSelect'} .${isMobile ? 'mobile-select-options' : 'select-options'}`
            );
            
            if (!optionsContainer) return;

            optionsContainer.innerHTML = '';
            
            Object.keys(variants).forEach(variantKey => {
                const variant = variants[variantKey];
                const option = document.createElement('div');
                option.className = isMobile ? 'mobile-select-option' : 'select-option';
                option.setAttribute('data-value', variantKey);
                option.textContent = variant.name;
                optionsContainer.appendChild(option);
            });

            const textElement = document.querySelector(
                `#${isMobile ? 'mobileVariantSelect' : 'variantSelect'} .${isMobile ? 'mobile-select-text' : 'select-text'}`
            );
            if (textElement) {
                textElement.textContent = 'Choose variant';
            }
        },

        populateBookingColors(modelKey, variantKey, isMobile) {
            const colors = this.bikeConfig[modelKey]?.variants[variantKey]?.colors;
            if (!colors) return;

            const colorGrid = document.getElementById(isMobile ? 'mobileColorGrid' : 'colorGrid');
            if (!colorGrid) return;

            colorGrid.innerHTML = '';

            colors.forEach(color => {
                const colorCard = document.createElement('div');
                colorCard.className = isMobile ? 'mobile-color-card' : 'color-card';
                colorCard.setAttribute('data-color', color);
                
                const colorPreview = document.createElement('div');
                colorPreview.className = isMobile ? 'mobile-color-preview' : 'color-preview';
                
                const colorValue = this.colorMappings[color] || '#CCCCCC';
                if (colorValue.includes('gradient')) {
                    colorPreview.style.background = colorValue;
                } else {
                    colorPreview.style.backgroundColor = colorValue;
                }
                
                const colorName = document.createElement('div');
                colorName.className = isMobile ? 'mobile-color-name' : 'color-name';
                colorName.textContent = color;
                
                colorCard.appendChild(colorPreview);
                colorCard.appendChild(colorName);
                
                colorCard.addEventListener('click', () => {
                    colorGrid.querySelectorAll(isMobile ? '.mobile-color-card' : '.color-card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    
                    colorCard.classList.add('selected');
                    this.handleColorSelect(color, isMobile);
                });
                
                colorGrid.appendChild(colorCard);
            });
        },

        hideSubsequentSections(fromSection, isMobile) {
            const sections = ['helmet', 'seat', 'delivery', 'info', 'insurance', 'additional', 'submit'];
            const startIndex = sections.indexOf(fromSection) + 1;
            
            for (let i = startIndex; i < sections.length; i++) {
                const sectionId = isMobile ? `mobile${sections[i].charAt(0).toUpperCase() + sections[i].slice(1)}Section` : `${sections[i]}Section`;
                const section = document.getElementById(sectionId);
                if (section) {
                    section.style.display = 'none';
                }
            }
            
            const orderSummary = document.getElementById(isMobile ? 'mobileOrderSummary' : 'orderSummary');
            if (orderSummary) {
                orderSummary.style.display = 'none';
            }
        },

        setupEventListeners() {
            this.setupHelmetSelection();
            this.setupSeatSelection();
            this.setupDeliveryDate();
            this.setupInsuranceToggle();
            this.setupAdditionalNotes();
            this.setupFormSubmission();
            
            document.addEventListener('click', this.closeAllBookingSelects.bind(this));
        },

        setupHelmetSelection() {
            document.querySelectorAll('.helmet-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.helmet-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    this.bookingState.selectedHelmet = card.getAttribute('data-type');
                    
                    this.showNextSection('seat', false);
                    this.updateBookingOrderSummary();
                });
            });
            
            document.querySelectorAll('.mobile-helmet-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.mobile-helmet-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    this.bookingState.selectedHelmet = card.getAttribute('data-type');
                    
                    this.showNextSection('seat', true);
                    this.updateBookingOrderSummary();
                });
            });
        },

        setupSeatSelection() {
            document.querySelectorAll('.seat-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.seat-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    this.bookingState.selectedSeat = card.getAttribute('data-color');
                    
                    this.showNextSection('delivery', false);
                    this.updateBookingOrderSummary();
                });
            });
            
            document.querySelectorAll('.mobile-seat-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.mobile-seat-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    this.bookingState.selectedSeat = card.getAttribute('data-color');
                    
                    this.showNextSection('delivery', true);
                    this.updateBookingOrderSummary();
                });
            });
        },

        setupDeliveryDate() {
            const deliveryInput = document.getElementById('deliveryDate');
            const mobileDeliveryInput = document.getElementById('mobileDeliveryDate');
            
            [deliveryInput, mobileDeliveryInput].forEach((input, index) => {
                if (input) {
                    input.addEventListener('change', (e) => {
                        this.bookingState.deliveryDate = e.target.value;
                        const isMobile = index === 1;
                        
                        this.showNextSection('info', isMobile);
                        
                        document.getElementById(isMobile ? 'mobileInsuranceSection' : 'insuranceSection').style.display = 'block';
                        document.getElementById(isMobile ? 'mobileAdditionalSection' : 'additionalSection').style.display = 'block';
                        
                        document.getElementById(isMobile ? 'mobileSubmitSection' : 'submitSection').style.display = 'block';
                        
                        this.updateBookingOrderSummary();
                    });
                }
            });
        },

        setupInsuranceToggle() {
            const insuranceToggle = document.getElementById('insuranceToggle');
            const mobileInsuranceToggle = document.getElementById('mobileInsuranceToggle');
            
            [insuranceToggle, mobileInsuranceToggle].forEach((toggle, index) => {
                if (toggle) {
                    toggle.addEventListener('change', (e) => {
                        this.bookingState.insurance = e.target.checked;
                        this.updateBookingOrderSummary();
                    });
                }
            });
        },

        setupAdditionalNotes() {
            const additionalNotes = document.getElementById('additionalNotes');
            const mobileAdditionalNotes = document.getElementById('mobileAdditionalNotes');
            
            [additionalNotes, mobileAdditionalNotes].forEach((textarea, index) => {
                if (textarea) {
                    textarea.addEventListener('input', (e) => {
                        this.bookingState.additionalNotes = e.target.value;
                        this.updateBookingOrderSummary();
                    });
                }
            });
        },

        setupFormSubmission() {
            const submitBtn = document.getElementById('submitBooking');
            const mobileSubmitBtn = document.getElementById('mobileSubmitBooking');
            
            [submitBtn, mobileSubmitBtn].forEach((btn, index) => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        this.handleBookingSubmission(index === 1);
                    });
                }
            });
        },

        showNextSection(sectionName, isMobile) {
            const sectionId = isMobile ? 
                `mobile${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}Section` : 
                `${sectionName}Section`;
            
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
                setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
            }
        },

        setMinimumDeliveryDate() {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const minDate = tomorrow.toISOString().split('T')[0];
            
            const deliveryInputs = ['deliveryDate', 'mobileDeliveryDate'];
            deliveryInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    input.min = minDate;
                }
            });
        },

        updateBookingOrderSummary() {
            const isMobile = this.bookingState.isMobile;
            const summaryElement = document.getElementById(isMobile ? 'mobileOrderSummary' : 'orderSummary');
            const summaryContent = document.querySelector(isMobile ? '#mobileOrderSummary .mobile-summary-content' : '#orderSummary .summary-content');
            
            if (!summaryElement || !summaryContent) return;
            
            if (!this.bookingState.selectedModel) {
                summaryElement.style.display = 'none';
                return;
            }
            
            let summaryHTML = '';
            
            if (this.bookingState.selectedModel) {
                const modelName = this.bikeConfig[this.bookingState.selectedModel].name;
                summaryHTML += `<div class="summary-item"><span>Model:</span><span>${modelName}</span></div>`;
            }
            
            if (this.bookingState.selectedVariant) {
                const variantName = this.bikeConfig[this.bookingState.selectedModel].variants[this.bookingState.selectedVariant].name;
                summaryHTML += `<div class="summary-item"><span>Variant:</span><span>${variantName}</span></div>`;
            }
            
            if (this.bookingState.selectedColor) {
                summaryHTML += `<div class="summary-item"><span>Color:</span><span>${this.bookingState.selectedColor}</span></div>`;
            }
            
            if (this.bookingState.selectedHelmet) {
                const helmetType = this.bookingState.selectedHelmet === 'full' ? 'Full Face' : 'Half Face';
                summaryHTML += `<div class="summary-item"><span>Free Helmet:</span><span>${helmetType} (Black)</span></div>`;
            }
            
            if (this.bookingState.selectedSeat) {
                const seatColor = this.bookingState.selectedSeat.charAt(0).toUpperCase() + this.bookingState.selectedSeat.slice(1);
                summaryHTML += `<div class="summary-item"><span>Seat Color:</span><span>${seatColor}</span></div>`;
            }
            
            if (this.bookingState.deliveryDate) {
                const formattedDate = new Date(this.bookingState.deliveryDate).toLocaleDateString();
                summaryHTML += `<div class="summary-item"><span>Delivery Date:</span><span>${formattedDate}</span></div>`;
            }
            
            if (this.bookingState.insurance !== null) {
                summaryHTML += `<div class="summary-item"><span>Insurance:</span><span>${this.bookingState.insurance ? 'Yes' : 'No'}</span></div>`;
            }
            
            if (this.bookingState.additionalNotes) {
                summaryHTML += `<div class="summary-item"><span>Additional:</span><span>${this.bookingState.additionalNotes.substring(0, 50)}${this.bookingState.additionalNotes.length > 50 ? '...' : ''}</span></div>`;
            }
            
            summaryContent.innerHTML = summaryHTML;
            summaryElement.style.display = 'block';
        },

        handleBookingSubmission(isMobile) {
            if (!this.bookingState.selectedModel || !this.bookingState.selectedVariant || !this.bookingState.selectedColor || 
                !this.bookingState.selectedHelmet || !this.bookingState.deliveryDate) {
                showNotification('error', 'Incomplete Selection', 'Please complete all required selections before booking.');
                return;
            }
            
            const selectedDate = new Date(this.bookingState.deliveryDate);
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            if (selectedDate < tomorrow) {
                showNotification('error', 'Invalid Date', 'Please select a future delivery date.');
                return;
            }
            
            const bookingData = {
                model: this.bikeConfig[this.bookingState.selectedModel].name,
                variant: this.bikeConfig[this.bookingState.selectedModel].variants[this.bookingState.selectedVariant].name,
                color: this.bookingState.selectedColor,
                helmet: this.bookingState.selectedHelmet === 'full' ? 'Full Face (Black)' : 'Half Face (Black)',
                seatColor: this.bookingState.selectedSeat.charAt(0).toUpperCase() + this.bookingState.selectedSeat.slice(1),
                deliveryDate: this.bookingState.deliveryDate,
                insurance: this.bookingState.insurance,
                additionalNotes: this.bookingState.additionalNotes || 'None',
                timestamp: new Date().toISOString()
            };
            
            console.log('Booking submitted:', bookingData);
            
            showNotification(
                'success', 
                'Booking Confirmed!', 
                `Thank you for choosing ${bookingData.model}! Our sales team will contact you within 24 hours to confirm your order and arrange the delivery details. We appreciate your business!`
            );
            
            setTimeout(() => {
                this.resetBookingForm(isMobile);
            }, 3000);
        },

        resetBookingForm(isMobile) {
            Object.keys(this.bookingState).forEach(key => {
                if (key === 'selectedSeat') {
                    this.bookingState[key] = 'default';
                } else if (key === 'insurance') {
                    this.bookingState[key] = false;
                } else if (key === 'additionalNotes') {
                    this.bookingState[key] = '';
                } else {
                    this.bookingState[key] = null;
                }
            });
            
            const sections = ['variant', 'color', 'helmet', 'seat', 'delivery', 'info', 'insurance', 'additional', 'submit'];
            sections.forEach(section => {
                const sectionId = isMobile ? 
                    `mobile${section.charAt(0).toUpperCase() + section.slice(1)}Section` : 
                    `${section}Section`;
                const sectionElement = document.getElementById(sectionId);
                if (sectionElement) {
                    sectionElement.style.display = 'none';
                }
            });
            
            const inputs = [
                'deliveryDate', 'mobileDeliveryDate',
                'insuranceToggle', 'mobileInsuranceToggle',
                'additionalNotes', 'mobileAdditionalNotes'
            ];
            
            inputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    if (input.type === 'checkbox') {
                        input.checked = false;
                    } else {
                        input.value = '';
                    }
                }
            });
            
            const selects = [
                { id: 'modelSelect', text: 'Choose your bike model' },
                { id: 'variantSelect', text: 'Choose variant' },
                { id: 'mobileModelSelect', text: 'Choose your bike' },
                { id: 'mobileVariantSelect', text: 'Choose variant' }
            ];
            
            selects.forEach(select => {
                const element = document.getElementById(select.id);
                if (element) {
                    const textElement = element.querySelector('.select-text, .mobile-select-text');
                    if (textElement) {
                        textElement.textContent = select.text;
                    }
                }
            });
            
            document.querySelectorAll('.color-card.selected, .mobile-color-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            
            document.querySelectorAll('.helmet-card.selected, .mobile-helmet-card.selected').forEach(card => {
                card.classList.remove('selected');
            });
            
            document.querySelectorAll('.seat-card, .mobile-seat-card').forEach(card => {
                card.classList.remove('active');
                if (card.getAttribute('data-color') === 'default') {
                    card.classList.add('active');
                }
            });
            
            const orderSummary = document.getElementById(isMobile ? 'mobileOrderSummary' : 'orderSummary');
            if (orderSummary) {
                orderSummary.style.display = 'none';
            }
            
            const bookingContainer = document.querySelector(isMobile ? '.mobile-booking-container' : '.booking-container');
            if (bookingContainer) {
                bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    // Initialize both systems
    QuotationSystem.init();
    BookingSystem.init();
});