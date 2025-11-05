let currentReview = 0;
      const reviews = document.querySelectorAll(".review");

      function rotateReviews() {
        reviews[currentReview].classList.remove("active");
        currentReview = (currentReview + 1) % reviews.length;
        reviews[currentReview].classList.add("active");
      }

      setInterval(rotateReviews, 3000);

      // Review rotation for mobile
      let currentMobileReview = 0;
      const mobileReviews = document.querySelectorAll(".mobile-review");

      function rotateMobileReviews() {
        mobileReviews[currentMobileReview].classList.remove("active");
        currentMobileReview = (currentMobileReview + 1) % mobileReviews.length;
        mobileReviews[currentMobileReview].classList.add("active");
      }

      setInterval(rotateMobileReviews, 3000);

      // Flip card functionality for mobile
      const flipCard = document.getElementById("flipCard");
      if (flipCard) {
        flipCard.addEventListener("click", function () {
          this.classList.toggle("flipped");
        });
      }
      // Navigation toggle script
      document.addEventListener("DOMContentLoaded", () => {
        const navToggle = document.getElementById("nav-toggle");
        navToggle.addEventListener("click", () => {
          document.body.classList.toggle("nav-open");
        });
        const mobileLinks = document.querySelectorAll(
          ".nav-mobile a, .nav-mobile button"
        );
        mobileLinks.forEach((link) => {
          link.addEventListener("click", () => {
            document.body.classList.remove("nav-open");
          });
        });
        window.addEventListener("resize", () => {
          if (
            window.innerWidth > 768 &&
            document.body.classList.contains("nav-open")
          ) {
            document.body.classList.remove("nav-open");
          }
        });
      });

      // Suzuki Access 125 animation script
      let isExpanded = false;
      let isAnimating = false;
      let sectionLocked = false;
      let lastScrollY = 0;
      let scrollDirection = 0;

      const infinitySection = document.getElementById("infinitySection");
      const rect1 = document.getElementById("rect1");
      const centerText = document.getElementById("centerText");
      const cards = ["rect2", "rect3", "rect4"];
      const shapes = document.querySelectorAll(".shape");
      const accessBrand = document.getElementById("accessBrand");
      const preBookBtn = document.getElementById("preBookBtn");
      const stepContent = document.getElementById("stepContent");
      const accessStatement = document.querySelector(".access-statement");

      function lockSection() {
        if (sectionLocked) return;
        sectionLocked = true;
        infinitySection.classList.add("section-locked");
        document.body.classList.add("scroll-locked");
      }

      function unlockSection() {
        if (!sectionLocked) return;
        sectionLocked = false;
        infinitySection.classList.remove("section-locked");
        document.body.classList.remove("scroll-locked");
      }

      function expandCards() {
        if (isExpanded || isAnimating) return;

        lockSection();
        isAnimating = true;
        isExpanded = true;

        // First shrink rect1 to its card position
        rect1.classList.add("shrunken");
        centerText.classList.add("moved");

        const animationSequence = [
          { element: stepContent, delay: 200 },
          { element: document.getElementById("rect3"), delay: 300 },
          { element: document.getElementById("rect4"), delay: 400 },
          { element: document.getElementById("rect2"), delay: 500 },
        ];

        animationSequence.forEach(({ element, delay }) => {
          setTimeout(() => {
            element.classList.add("visible");
          }, delay);
        });

        // Show SVG shapes, brand and button
        setTimeout(() => {
          shapes.forEach((shape) => {
            shape.classList.add("visible");
          });
          accessBrand.classList.add("visible");
          preBookBtn.classList.add("visible");
          accessStatement.classList.add("visible");
        }, 600);

        setTimeout(() => {
          isAnimating = false;
          unlockSection();
        }, 1800);
      }

      function collapseCards() {
        if (!isExpanded || isAnimating) return;

        lockSection();
        isAnimating = true;
        isExpanded = false;

        // Hide all cards and content
        cards.forEach((cardId) => {
          document.getElementById(cardId).classList.remove("visible");
        });
        stepContent.classList.remove("visible");

        // Hide SVG shapes, brand and button
        shapes.forEach((shape) => {
          shape.classList.remove("visible");
        });
        accessBrand.classList.remove("visible");
        preBookBtn.classList.remove("visible");
        accessStatement.classList.remove("visible");

        // Expand rect1 back to full screen
        setTimeout(() => {
          rect1.classList.remove("shrunken");
          centerText.classList.remove("moved");
        }, 300);

        setTimeout(() => {
          isAnimating = false;
          unlockSection();
        }, 1500);
      }

      function handleScroll() {
        if (sectionLocked || isAnimating) return;

        const scrollY = window.pageYOffset;
        const sectionTop = infinitySection.offsetTop;

        scrollDirection = scrollY > lastScrollY ? 1 : -1;
        lastScrollY = scrollY;

        if (scrollY >= sectionTop - 50 && scrollY <= sectionTop + 50) {
          if (scrollDirection > 0 && !isExpanded) {
            expandCards();
          } else if (scrollDirection < 0 && isExpanded) {
            collapseCards();
          }
        }
      }

      let scrollTimeout;
      window.addEventListener("scroll", () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 10);
      });

      const bikeData = [
        {
          id: "avenis",
          name: "Avenis",
          image:
            "https://imgd.aeplcdn.com/1280x720/n/lbuk7fb_1822917.jpg?q=100",
          features: [
            "124cc fuel-injected engine",
            "Digital instrument console",
            "45 kmpl mileage",
          ],
        },
        {
          id: "burgman-street",
          name: "Burgman Street",
          image:
            "https://cdn.suzukimotorcycle.co.in/public-live/uploads/color-images/original/burgman_ride_connect_metallic_matte_titanium_silver.jpg",
          features: [
            "124cc fuel-injected engine",
            "Large underseat storage",
            "LED headlamp & tail lamp",
          ],
        },
        {
          id: "burgman-street-ex",
          name: "Burgman Street 125 EX",
          image:
            "https://cdn.suzukimotorcycle.co.in/public-live/uploads/color-images/original/burgman-ex-metallic-matte-stellar-blue.jpg",
          features: [
            "Enhanced comfort features",
            "Premium styling elements",
            "Advanced connectivity",
          ],
        },
        {
          id: "gixxer-sf-150",
          name: "Gixxer SF 150",
          image:
            "https://cdn.suzukimotorcycle.co.in/public-live/uploads/color-images/original/Gixxer-sfMet-Triton-Blue-Pearl-Glacier-White.jpg",
          features: [
            "154.9cc oil-cooled engine",
            "Full fairing sports design",
            "Racing-inspired aesthetics",
          ],
        },
        {
          id: "vstrom-250",
          name: "V-Strom 250",
          image:
            "https://www.rydersarena.in/cdn/shop/collections/Suzuki_V-Strom_SX.jpg?v=1718819925",
          features: [
            "248cc liquid-cooled engine",
            "Adventure touring capability",
            "19-inch front wheel",
          ],
        },
        {
          id: "access-125-standard",
          name: "Access 125 Standard",
          image:
            "https://cdn.bikedekho.com/processedimages/suzuki/2025-access-125/640X309/2025-access-125687a260fc5f14.jpg?imwidth=360&impolicy=resize",
          features: [
            "124cc fuel-injected engine",
            "60 kmpl fuel efficiency",
            "Practical everyday commuting",
          ],
        },
        {
          id: "access-125-special",
          name: "Access 125 Special Edition",
          image:
            "https://imgd.aeplcdn.com/1056x594/n/i2tsjfb_1820545.jpeg?q=80",
          features: [
            "Premium color schemes",
            "Enhanced design elements",
            "Special edition badging",
          ],
        },
        {
          id: "access-125-ride-connect",
          name: "Access 125 Ride Connect Edition",
          image:
            "https://imgd.aeplcdn.com/1056x594/n/i2tsjfb_1820545.jpeg?q=80",
          features: [
            "Smartphone connectivity",
            "Bluetooth enabled features",
            "Digital instrument cluster",
          ],
        },
        {
          id: "access-125-tft",
          name: "Access 125 Ride Connect TFT Edition",
          image:
            "https://cdn.bikedekho.com/processedimages/suzuki/2025-access-125/source/2025-access-12568314f20a5158.jpg?imwidth=408&impolicy=resize",
          features: [
            "Full-color TFT display",
            "Advanced connectivity suite",
            "Premium tech features",
          ],
        },
      ];

      let currentBikeIndex = 0;
      let isTransitioning = false;

      function initBikesShowcase() {
        generateThumbnails();
        updateDisplay(0);
      }

      function generateThumbnails() {
        const container = document.getElementById("thumbnailContainer");

        bikeData.forEach((bike, index) => {
          const thumbnail = document.createElement("div");
          thumbnail.className = `thumbnail-item ${index === 0 ? "active" : ""}`;
          thumbnail.onclick = () => selectBike(index);

          thumbnail.innerHTML = `
            <img src="${bike.image}" alt="${bike.name}" class="thumbnail-image">
            <div class="thumbnail-name">${bike.name}</div>
          `;

          container.appendChild(thumbnail);
        });
      }

      // Select bike from thumbnail with smooth transition
      function selectBike(index, isAutoPlay = false) {
        if (index === currentBikeIndex || isTransitioning) return;

        isTransitioning = true;
        const detailImage = document.getElementById("detailImage");

        // Start shrink animation
        detailImage.classList.add("transitioning-out");

        setTimeout(() => {
          currentBikeIndex = index;
          updateContent(index);
          updateThumbnailActive(index, isAutoPlay); // Pass isAutoPlay flag

          // Start expand animation
          detailImage.classList.remove("transitioning-out");
          detailImage.classList.add("transitioning-in");

          setTimeout(() => {
            detailImage.classList.remove("transitioning-in");
            isTransitioning = false;
          }, 600);
        }, 300);
      }

      // Update content without transition effects
      function updateContent(index) {
        const bike = bikeData[index];

        document.getElementById("detailImage").src = bike.image;
        document.getElementById("detailImage").alt = bike.name;
        document.getElementById("detailName").textContent = bike.name;

        const featuresContainer = document.getElementById("detailFeatures");
        featuresContainer.innerHTML = bike.features
          .map((feature) => `<li>${feature}</li>`)
          .join("");
      }

      // Update display for initial load
      function updateDisplay(index) {
        const bike = bikeData[index];

        document.getElementById("detailImage").src = bike.image;
        document.getElementById("detailImage").alt = bike.name;
        document.getElementById("detailName").textContent = bike.name;

        const featuresContainer = document.getElementById("detailFeatures");
        featuresContainer.innerHTML = bike.features
          .map((feature) => `<li>${feature}</li>`)
          .join("");
      }

      // Update active thumbnail
      function updateThumbnailActive(index, isAutoPlay = false) {
        const thumbnails = document.querySelectorAll(".thumbnail-item");
        thumbnails.forEach((thumb, i) => {
          thumb.classList.toggle("active", i === index);
        });

        // Only scroll into view if not triggered by auto-play
        if (!isAutoPlay) {
          const activeThumb = thumbnails[index];
          activeThumb.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }

      // Navigation functions
      function nextBike(isAutoPlay = false) {
        const nextIndex = (currentBikeIndex + 1) % bikeData.length;
        selectBike(nextIndex, isAutoPlay);
      }

      function previousBike() {
        const prevIndex =
          (currentBikeIndex - 1 + bikeData.length) % bikeData.length;
        selectBike(prevIndex);
      }

      // Keyboard navigation
      document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
          previousBike();
        } else if (e.key === "ArrowRight") {
          nextBike();
        }
      });

      // Touch/swipe support for main display
      let startX = 0;
      let startY = 0;
      let threshold = 50;

      document
        .getElementById("bikeDetailView")
        .addEventListener("touchstart", (e) => {
          startX = e.touches[0].clientX;
          startY = e.touches[0].clientY;
        });

      document
        .getElementById("bikeDetailView")
        .addEventListener("touchend", (e) => {
          const endX = e.changedTouches[0].clientX;
          const endY = e.changedTouches[0].clientY;
          const deltaX = endX - startX;
          const deltaY = endY - startY;

          // Only register horizontal swipes
          if (
            Math.abs(deltaX) > Math.abs(deltaY) &&
            Math.abs(deltaX) > threshold
          ) {
            if (deltaX > 0) {
              previousBike();
            } else {
              nextBike();
            }
          }
        });

      // Auto-play functionality
      let autoPlayInterval;

      function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
          nextBike(true); // Pass true to indicate auto-play
        }, 6000);
      }

      function stopAutoPlay() {
        clearInterval(autoPlayInterval);
      }

      window.addEventListener(
        "wheel",
        (e) => {
          if (sectionLocked) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      window.addEventListener(
        "touchmove",
        (e) => {
          if (sectionLocked) {
            e.preventDefault();
          }
        },
        { passive: false }
      );

      window.addEventListener("keydown", (e) => {
        if (
          sectionLocked &&
          [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)
        ) {
          e.preventDefault();
        }
      });

      // Pre-book button click handler
      preBookBtn.addEventListener("click", () => {
        window.location.href = "../login/login.html";
      });

      // Adjust for mobile devices on load
      window.addEventListener("load", () => {
        if (window.innerWidth <= 768) {
          // On mobile, show all elements immediately
          rect1.classList.add("shrunken");
          centerText.classList.add("moved");

          cards.forEach((cardId) => {
            document.getElementById(cardId).classList.add("visible");
          });

          stepContent.classList.add("visible");
          accessBrand.classList.add("visible");
          preBookBtn.classList.add("visible");

          // Disable scroll animations on mobile
          window.removeEventListener("scroll", handleScroll);
          initBikesShowcase();
          startAutoPlay();
        }
      });

      // Notification System
      function showNotification(type, title, message, duration = 4000) {
        const notification = document.getElementById("notification");
        const iconMap = {
          success: "fa-check-circle",
          error: "fa-exclamation-circle",
          warning: "fa-exclamation-triangle",
          info: "fa-info-circle",
        };

        // Set notification content
        notification.className = `notification ${type} show`;
        notification.querySelector(".notification-icon i").className = `fas ${
          iconMap[type] || "fa-info-circle"
        }`;
        notification.querySelector(".notification-title").textContent = title;
        notification.querySelector(".notification-message").textContent =
          message;

        // Auto hide after duration
        setTimeout(() => {
          notification.classList.remove("show");
        }, duration);

        // Close button functionality
        notification.querySelector(".notification-close").onclick = () => {
          notification.classList.remove("show");
        };
      }

      // Intersection Observer for animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      }, observerOptions);

      // Observe all animation elements
      document.addEventListener("DOMContentLoaded", () => {
        const animatedElements = document.querySelectorAll(
          ".fade-in, .slide-in-left, .slide-in-right"
        );
        animatedElements.forEach((el) => observer.observe(el));
      });

      // Form submission handler
    document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    if (!data.firstName || !data.email || !data.phone || !data.message) {
      showNotification("error", "Error", "Please fill in all required fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      showNotification("error", "Error", "Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const phoneNumber = data.phone.replace(/\D/g, "");
    if (!phoneRegex.test(phoneNumber)) {
      showNotification("error", "Error", "Please enter a valid 10-digit Indian phone number.");
      return;
    }

    const submitBtn = contactForm.querySelector(".submit-btn");
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName.trim(),
          email: data.email.trim(),
          phone: phoneNumber,
          message: data.message.trim(),
        }),
      });

      // Check if response is valid JSON
      const contentType = response.headers.get("content-type");
      let result;
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Unexpected response: ${text}`);
      }

      if (response.ok && result.success) {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = "linear-gradient(135deg, #28a745, #20c997)";

        showNotification("success", "Success", result.message);

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
          contactForm.reset();
        }, 2000);
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      showNotification("error", "Submission Failed", error.message);
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = "";
      submitBtn.disabled = false;
      console.error("Contact form submission error:", error);
    }
  });
});


      // Back to top functionality
      const backToTopBtn = document.getElementById("backToTop");

      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 300) {
          backToTopBtn.classList.add("visible");
        } else {
          backToTopBtn.classList.remove("visible");
        }
      });

      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      // Smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });

      // Video back-and-forth effect
      const tourVideo = document.getElementById("tourVideo");
      if (tourVideo) {
        tourVideo.addEventListener("ended", function () {
          this.currentTime = this.duration;
          this.playbackRate = -1;
          this.play();
        });

        tourVideo.addEventListener("timeupdate", function () {
          if (this.currentTime <= 0 && this.playbackRate < 0) {
            this.playbackRate = 1;
            this.play();
          }
        });
      }

      // Enhanced form input animations
      const formInputs = document.querySelectorAll(
        ".form-input, .form-textarea"
      );

      formInputs.forEach((input) => {
        input.addEventListener("focus", () => {
          input.parentElement.classList.add("focused");
        });

        input.addEventListener("blur", () => {
          if (!input.value) {
            input.parentElement.classList.remove("focused");
          }
        });

        // Add ripple effect on click
        input.addEventListener("click", function (e) {
          const ripple = document.createElement("span");
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(0, 102, 204, 0.1);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

          this.style.position = "relative";
          this.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      });

      // Add ripple animation styles
      const style = document.createElement("style");
      style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            .form-group.focused .form-label {
                color: var(--primary);
                transform: translateY(-2px);
            }
        `;
      document.head.appendChild(style);

      // Social links hover effects
      const socialLinks = document.querySelectorAll(".social-link");
      socialLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          link.style.transform = "translateY(-3px) scale(1.1)";
        });

        link.addEventListener("mouseleave", () => {
          link.style.transform = "translateY(0) scale(1)";
        });
      });

      // Contact details hover effects
      const detailItems = document.querySelectorAll(".detail-item");
      detailItems.forEach((item) => {
        item.addEventListener("mouseenter", () => {
          const icon = item.querySelector(".detail-icon");
          icon.style.transform = "scale(1.1) rotate(5deg)";
        });

        item.addEventListener("mouseleave", () => {
          const icon = item.querySelector(".detail-icon");
          icon.style.transform = "scale(1) rotate(0deg)";
        });
      });

      // Map interaction
      const mapContainer = document.querySelector(".map-container");
      if (mapContainer) {
        mapContainer.addEventListener("click", () => {
          window.open(
            "https://maps.app.goo.gl/WchKCF1R7mhe34HW6?g_st=iw",
            "_blank"
          );
        });

        mapContainer.style.cursor = "pointer";

        // Add hover effect tooltip
        const tooltip = document.createElement("div");
        tooltip.textContent = "Click to open in Google Maps";
        tooltip.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 5px;
                font-size: 12px;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
                z-index: 10;
            `;

        mapContainer.style.position = "relative";
        mapContainer.appendChild(tooltip);

        mapContainer.addEventListener("mouseenter", () => {
          tooltip.style.opacity = "1";
        });

        mapContainer.addEventListener("mouseleave", () => {
          tooltip.style.opacity = "0";
        });
      }

      // Performance optimization: Lazy load animations
      const lazyAnimationObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.style.animationPlayState = "running";
            } else {
              entry.target.style.animationPlayState = "paused";
            }
          });
        },
        { threshold: 0.1 }
      );

      // Apply to animated elements
      document.querySelectorAll('[style*="animation"]').forEach((el) => {
        el.style.animationPlayState = "paused";
        lazyAnimationObserver.observe(el);
      });

      // Add loading state for iframe
      const iframe = document.querySelector(".map-container iframe");
      if (iframe) {
        const loader = document.createElement("div");
        loader.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Loading Map...';
        loader.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: var(--primary);
                font-size: 18px;
                z-index: 5;
            `;

        iframe.parentElement.appendChild(loader);

        iframe.addEventListener("load", () => {
          loader.remove();
        });
      }

      // Initialize animations on page load
      window.addEventListener("load", () => {
        // Trigger initial animations
        setTimeout(() => {
          document
            .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right")
            .forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("visible");
              }, index * 100);
            });
        }, 200);
        initBikesShowcase();
        startAutoPlay();
      });
      // Suzuki Access 125 Bluetooth Section Scripts
      document.addEventListener("DOMContentLoaded", function () {
        // Color Selection Functionality
        const colorOptions = document.querySelectorAll(".color-option");
        const heroSection = document.getElementById("heroSection");
        const mainScooterImage = document.getElementById("mainScooterImage");

        colorOptions.forEach((option) => {
          option.addEventListener("click", function () {
            // Remove active class from all options
            colorOptions.forEach((opt) => opt.classList.remove("active"));

            // Add active class to clicked option
            this.classList.add("active");

            // Change background theme
            const theme = this.getAttribute("data-theme");
            heroSection.className = `vstromview-bg ${theme}`;

            // Change scooter image
            const imageUrl = this.getAttribute("data-image");
            mainScooterImage.classList.add("color-transition");
            setTimeout(() => {
              mainScooterImage.src = imageUrl;
              mainScooterImage.classList.remove("color-transition");
            }, 400);
          });
        });

        // Section Navigation
        const navItems = document.querySelectorAll(".nav-item");
        const contentSections = document.querySelectorAll(".content-section");

        navItems.forEach((item) => {
          item.addEventListener("click", function () {
            // Remove active class from all nav items
            navItems.forEach((nav) => nav.classList.remove("active"));

            // Add active class to clicked item
            this.classList.add("active");

            // Hide all content sections
            contentSections.forEach((section) =>
              section.classList.remove("active")
            );

            // Show selected content section
            const sectionId = this.getAttribute("data-section");
            document.getElementById(sectionId).classList.add("active");
          });
        });

        // Book Now Button
        const bookNowBtn = document.getElementById("bookNowBtn");
        bookNowBtn.addEventListener("click", function () {
          window.location.href = "../login/login.html";
        });

        // Auto-play videos when section is visible
        const videoObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const videos = entry.target.querySelectorAll("video");
                videos.forEach((video) => {
                  video
                    .play()
                    .catch((e) => console.log("Auto-play prevented:", e));
                });
              }
            });
          },
          { threshold: 0.5 }
        );

        document.querySelectorAll(".content-section").forEach((section) => {
          videoObserver.observe(section);
        });
      });