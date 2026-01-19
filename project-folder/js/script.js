document.addEventListener("DOMContentLoaded", () => {
  // 1. Hover effect for Navigation Dropdown
  const dropdown = document.querySelector(".dropdown");

  dropdown.addEventListener("mouseenter", () => {
    const icon = dropdown.querySelector("i");
    icon.style.transform = "rotate(180deg)";
    icon.style.transition = "transform 0.3s ease";
  });

  dropdown.addEventListener("mouseleave", () => {
    const icon = dropdown.querySelector("i");
    icon.style.transform = "rotate(0deg)";
  });

  // 3. Simple Number Counter Animation for Stats
  const stats = document.querySelectorAll(".stat-num");

  stats.forEach((stat) => {
    const originalText = stat.innerText;
    // Check if it's a number we can animate (remove 'x', '+', 'K')
    const numericValue = parseInt(originalText.replace(/[^0-9]/g, ""));

    if (!isNaN(numericValue)) {
      let current = 0;
      const increment = Math.ceil(numericValue / 50); // Speed of count

      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          stat.innerText = originalText; // Restore original formatting (e.g. 20K+)
          clearInterval(timer);
        } else {
          // Temporarily show raw number during count
          stat.innerText =
            current +
            (originalText.includes("x") ? "x" : "") +
            (originalText.includes("+") ? "+" : "");
        }
      }, 30);
    }
  });

  // --- 1. Hamburger Menu Logic ---
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.innerHTML = '<i class="fas fa-bars"></i>';

  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelector(".nav-links");
  // Insert hamburger into navbar if not present
  if (!document.querySelector(".hamburger")) {
    navbar.insertBefore(hamburger, navbar.children[0]);
  }

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const icon = hamburger.querySelector("i");
    if (navLinks.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // --- 2. Product Gallery Logic ---
  const images = [
    "/project-folder/assets/preview-1.png",
    "/project-folder/assets/preview-2.png",
    "/project-folder/assets/preview-3.png",
    "/project-folder/assets/preview-4.png",
    "/project-folder/assets/preview-5.png",
    "/project-folder/assets/preview-2.png",
    "/project-folder/assets/preview-3.png",
    "/project-folder/assets/preview-4.png",
  ];

  let currentIndex = 0;
  const mainImg = document.getElementById("currentImage");
  const dots = document.querySelectorAll(".dot");
  const thumbs = document.querySelectorAll(".thumb");

  function updateGallery(index) {
    // Fade effect
    mainImg.style.opacity = "0.5";
    setTimeout(() => {
      mainImg.src = images[index];
      mainImg.style.opacity = "1";
    }, 150);

    // Update active states
    dots.forEach((d) => d.classList.remove("active"));
    thumbs.forEach((t) => t.classList.remove("active"));

    dots[index].classList.add("active");
    thumbs[index].classList.add("active");
    currentIndex = index;
  }

  // Arrow clicks
  document.querySelector(".next-btn").addEventListener("click", () => {
    let newIndex = (currentIndex + 1) % images.length;
    updateGallery(newIndex);
  });

  document.querySelector(".prev-btn").addEventListener("click", () => {
    let newIndex = (currentIndex - 1 + images.length) % images.length;
    updateGallery(newIndex);
  });

  // Thumbnail & Dot clicks
  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      updateGallery(parseInt(e.target.dataset.index));
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      updateGallery(parseInt(e.target.dataset.index));
    });
  });

  // --- 3. Dynamic Add to Cart & Radio Logic ---
  const cartBtn = document.getElementById("addToCartBtn");

  // Functions exposed to window for HTML onclick attributes
  window.toggleSubscription = function (type) {
    // Toggle visual expansion
    const detailsSingle = document.getElementById("details-single");
    const detailsDouble = document.getElementById("details-double");
    const cardSingle = document.getElementById("card-single");
    const cardDouble = document.getElementById("card-double");

    if (type === "single") {
      detailsSingle.style.display = "block";
      detailsDouble.style.display = "none";
      cardSingle.classList.add("active");
      cardDouble.classList.remove("active");
    } else {
      detailsSingle.style.display = "none";
      detailsDouble.style.display = "block";
      cardSingle.classList.remove("active");
      cardDouble.classList.add("active");
    }
    updateCartLink();
  };

  window.selectFragrance = function (fragranceName) {
    // Visual selection logic
    const options = document.querySelectorAll(".frag-option");
    options.forEach((opt) => opt.classList.remove("selected"));

    // Find clicked element
    const clickedOption = event.currentTarget;
    clickedOption.classList.add("selected");

    const radio = clickedOption.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;

    updateCartLink();
  };

  function updateCartLink() {
    const subType = document.querySelector(
      'input[name="purchaseType"]:checked',
    ).value;
    const fragType = document.querySelector(
      'input[name="fragrance"]:checked',
    ).value;

    const doubleFrag1Type = document.querySelector(
      'input[name="fragrance-1"]:checked',
    ).value;

    const doubleFrag2Type = document.querySelector(
      'input[name="fragrance-2"]:checked',
    ).value;

    const query =
      subType === "single"
        ? `fragrance=${fragType}`
        : `fragrance1=${doubleFrag1Type}&fragrance2=${doubleFrag2Type}`;

    // Generate Dummy Link with parameters
    const dummyLink = `#cart/add?subscription=${subType}&${query}`;
    cartBtn.href = dummyLink;
    const btnContent =
      subType === "double"
        ? generateLabel(doubleFrag1Type) +
          " & " +
          generateLabel(doubleFrag2Type)
        : generateLabel(fragType);

    // Update Text for feedback
    cartBtn.textContent = `Add to Cart - ${btnContent} (${generateLabel(subType)} Sub)`;
  }

  function generateLabel(type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  // --- 4. Number Counter Animation on Scroll ---
  const statsSection = document.getElementById("statsSection");
  const counters = document.querySelectorAll(".counter");
  let started = false;

  function startCounting() {
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000;
      const increment = target / (duration / 16);

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.innerText = target;
          clearInterval(timer);
        } else {
          counter.innerText = Math.ceil(current);
        }
      }, 16);
    });
  }

  // Observer to trigger when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !started) {
          startCounting();
          started = true;
        }
      });
    },
    { threshold: 0.5 },
  );

  if (statsSection) observer.observe(statsSection);

  // --- 5. Accordion Logic ---
  const accHeaders = document.querySelectorAll(".accordion-header");

  accHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const body = item.querySelector(".accordion-body");
      const icon = header.querySelector("i");

      // Close others
      document.querySelectorAll(".accordion-item").forEach((i) => {
        if (i !== item) {
          i.querySelector(".accordion-body").style.display = "none";
          i.querySelector("i").classList.remove("fa-minus");
          i.querySelector("i").classList.add("fa-plus");
        }
      });

      // Toggle current
      if (body.style.display === "block") {
        body.style.display = "none";
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
      } else {
        body.style.display = "block";
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      }
    });
  });

  // Initialize Default State
  updateGallery(0);

  updateCartLink(); // <--- This forces the link to update immediately on load
});
