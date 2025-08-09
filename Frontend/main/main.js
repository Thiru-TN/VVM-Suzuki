document.addEventListener("DOMContentLoaded", function () {
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

        // Notification System
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

        // Logout Modal
        const logoutModal = document.getElementById("logoutModal");
        const logoutButtons = document.querySelectorAll(
          ".logout-btn, .mobile-logout-btn"
        );
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
            showNotification(
              "success",
              "Logged Out",
              "You have been successfully logged out"
            );
            setTimeout(() => {
              window.location.href = "../login/login.html";
            }, 1500);
          });
        }

        // Show welcome notification
        setTimeout(() => {
          showNotification(
            "success",
            "Welcome Back",
            "You have successfully logged in as Anand"
          );
        }, 1000);

        // MAIN NAVIGATION SYSTEM
        let currentActiveSection = null;
        let morphingInterval = null;
        const isMobile = () => window.innerWidth <= 768;

        const wrapper = document.getElementById("wrapper");
        const dashboardContainer =
          document.getElementById("dashboardContainer");
        const sidebarContainer = document.getElementById("sidebarContainer");
        const contentArea = document.getElementById("contentArea");
        const bottomNav = document.getElementById("bottomNav");

        // Desktop Section Management
        function activateDesktopSection(sectionName) {
          if (currentActiveSection === sectionName) {
            // Deactivate current section - return to initial state
            deactivateAllSections();
            return;
          }

          // Set new active section
          currentActiveSection = sectionName;

          // Hide dashboard and show sidebar layout
          dashboardContainer.classList.add("hidden");
          sidebarContainer.classList.add("active");

          // Clear all active states first
          document
            .querySelectorAll(".sidebar-shapes .shape")
            .forEach((shape) => {
              shape.classList.remove("active");
            });
          document.querySelectorAll(".content-section").forEach((section) => {
            section.classList.remove("active");
          });

          // Activate the selected shape in both sidebars
          const leftShape = document.querySelector(
            `#leftSidebar .shape[data-section="${sectionName}"]`
          );
          const rightShape = document.querySelector(
            `#rightSidebar .shape[data-section="${sectionName}"]`
          );

          if (leftShape) leftShape.classList.add("active");
          if (rightShape) rightShape.classList.add("active");

          // Show the corresponding content section
          const contentSection = document.getElementById(
            `${sectionName}Section`
          );
          if (contentSection) {
            setTimeout(() => {
              contentSection.classList.add("active");
            }, 300);
          }

          // Stop main morphing
          clearInterval(morphingInterval);
        }

        // Mobile Section Management
        function activateMobileSection(sectionName) {
          if (currentActiveSection === sectionName) {
            // Deactivate current section - return to initial state
            deactivateAllSections();
            return;
          }

          // Set new active section
          currentActiveSection = sectionName;

          // Hide dashboard
          dashboardContainer.classList.add("hidden");

          // Clear all mobile active states
          document.querySelectorAll(".bottom-nav-item").forEach((item) => {
            item.classList.remove("active");
          });
          document.querySelectorAll(".mobile-content").forEach((section) => {
            section.classList.remove("active");
          });

          // Activate the clicked bottom nav item
          const navItem = document.querySelector(
            `.bottom-nav-item[data-section="${sectionName}"]`
          );
          if (navItem) navItem.classList.add("active");

          // Show bottom navigation
          bottomNav.classList.add("active");

          // Show the corresponding mobile content section
          const mobileSection = document.getElementById(
            `mobile${
              sectionName.charAt(0).toUpperCase() + sectionName.slice(1)
            }Section`
          );
          if (mobileSection) {
            setTimeout(() => {
              mobileSection.classList.add("active");
            }, 300);
          }

          // Stop main morphing
          clearInterval(morphingInterval);
        }

        // Deactivate all sections and return to initial state
        function deactivateAllSections() {
          currentActiveSection = null;

          // Desktop cleanup
          sidebarContainer.classList.remove("active");
          document
            .querySelectorAll(".sidebar-shapes .shape")
            .forEach((shape) => {
              shape.classList.remove("active");
            });
          document.querySelectorAll(".content-section").forEach((section) => {
            section.classList.remove("active");
          });

          // Mobile cleanup
          document.querySelectorAll(".bottom-nav-item").forEach((item) => {
            item.classList.remove("active");
          });
          document.querySelectorAll(".mobile-content").forEach((section) => {
            section.classList.remove("active");
          });
          bottomNav.classList.remove("active");

          // Show dashboard again
          setTimeout(() => {
            dashboardContainer.classList.remove("hidden");
            // Restart main morphing
            startMainMorphing();
          }, 300);
        }

        // Main morphing functionality
        const rand = (min, max) =>
          Math.floor(Math.random() * (max - min + 1) + min);
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
            if (
              !currentActiveSection &&
              !dashboardContainer.classList.contains("hidden")
            ) {
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

        // Start main morphing initially
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
        const sidebarShapes = document.querySelectorAll(
          ".sidebar-shapes .shape"
        );
        sidebarShapes.forEach((shape) => {
          shape.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const sectionName = this.getAttribute("data-section");
            if (sectionName) {
              if (currentActiveSection === sectionName) {
                // Same section clicked - return to initial
                deactivateAllSections();
              } else {
                // Different section - switch to it
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
                // Same section clicked - return to initial
                deactivateAllSections();
              } else {
                // Different section - switch to it
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
            const wasMobile =
              currentActiveSection && bottomNav.classList.contains("active");
            const isNowMobile = isMobile();

            if (wasMobile && !isNowMobile) {
              // Switched from mobile to desktop
              deactivateAllSections();
            } else if (!wasMobile && isNowMobile && currentActiveSection) {
              // Switched from desktop to mobile
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

        // Prevent clicks on content area from closing sections
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
