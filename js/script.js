/* 
Project Name: Modern Portfolio Website
Description: A complete responsive modern portfolio website design
             by using HTML CSS and Vanilla JavaScript from scratch.
Author: Md Al Amin Hossen
Github: https://github.com/MdRasen
License: MIT License
Copyright: 2023 ©MdRasen 
*/

// Typing animation
var typed = new Typed(".typing", {
  strings: [
    "Web Developer",
    "Mobile Developer",
    "Game Developer",
    "Web3 Developer",
  ],
  typeSpeed: 100,
  BackSpeed: 60,
  loop: true,
});

// Aside
const nav = document.querySelector(".nav");
if (nav) {
  const navList = nav.querySelectorAll("li"),
    totalNavList = navList.length,
    allSection = document.querySelectorAll(".section"),
    totalSection = allSection.length;

  for (let i = 0; i < totalNavList; i++) {
    const a = navList[i].querySelector("a");
    if (a) {
      a.addEventListener("click", function () {
        for (let k = 0; k < totalSection; k++) {
          allSection[k].classList.remove("back-section");
        }
        //Loop for removing active class
        for (let j = 0; j < totalNavList; j++) {
          if (navList[j].querySelector("a").classList.contains("active")) {
            allSection[j].classList.add("back-section");
          }
          navList[j].querySelector("a").classList.remove("active");
        }
        //Adding active class
        this.classList.add("active");
        showSection(this); //Function call
        //Nav click event - Hiding the nav menu
        if (window.innerWidth < 1200) {
          asideSectionTogglerBtn();
        }
      });
    }
  }
}

function showSection(element) {
  const allSection = document.querySelectorAll(".section");
  const totalSection = allSection.length;
  //Loop for removing active class
  for (let k = 0; k < totalSection; k++) {
    allSection[k].classList.remove("active");
  }
  const target = element.getAttribute("href").split("#")[1];
  document.querySelector("#" + target).classList.add("active");
}

//For Hire me section
const hireMeBtn = document.querySelector(".hire-me");
if (hireMeBtn) {
  hireMeBtn.addEventListener("click", function () {
    showSection(this);
    updateNav(this);
  });
}

function updateNav(element) {
  const nav = document.querySelector(".nav");
  if (nav) {
    const navList = nav.querySelectorAll("li");
    const totalNavList = navList.length;
    for (let i = 0; i < totalNavList; i++) {
      const navLink = navList[i].querySelector("a");
      if (navLink) {
        navLink.classList.remove("active");
        const target = element.getAttribute("href").split("#")[1];
        if (
          target ===
          navLink.getAttribute("href").split("#")[1]
        ) {
          navLink.classList.add("active");
        }
      }
    }
  }
}

//For Nav Toggler Button
const navTogglerBtn = document.querySelector(".nav-toggler");
const aside = document.querySelector(".aside");

if (navTogglerBtn && aside) {
  navTogglerBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    asideSectionTogglerBtn();
  });
}

function asideSectionTogglerBtn() {
  if (aside && navTogglerBtn) {
    aside.classList.toggle("open");
    navTogglerBtn.classList.toggle("open");
  }
}

// Prevent sidebar from opening when clicking contact icons on mobile
const contactIconLinks = document.querySelectorAll(".contact-icon-link");
contactIconLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.stopPropagation();
    // Don't close sidebar if it's open and user clicks contact icon
    if (window.innerWidth < 1200 && aside && aside.classList.contains("open")) {
      // Keep sidebar open, just prevent any toggle
      return;
    }
  });
});

// Progress bar recharge animation on hover
function initProgressBarAnimation() {
  const skillsItems = document.querySelectorAll(".skills-item");
  
  skillsItems.forEach((item) => {
    const progressIn = item.querySelector(".progress-in");
    if (progressIn && progressIn.hasAttribute("data-width")) {
      const targetWidth = progressIn.getAttribute("data-width");
      
      // Set initial width from data attribute
      progressIn.style.width = targetWidth;
      
      let animationTimeout = null;
      
      item.addEventListener("mouseenter", function() {
        // Clear any existing timeout
        if (animationTimeout) {
          clearTimeout(animationTimeout);
          animationTimeout = null;
        }
        
        // Force reflow to ensure current state is applied
        void progressIn.offsetWidth;
        
        // First animate to 0% (with fast transition)
        progressIn.classList.add("fast-transition");
        progressIn.style.width = "0";
        
        // After reset animation completes, animate to target
        animationTimeout = setTimeout(() => {
          // Force reflow again
          void progressIn.offsetWidth;
          progressIn.classList.remove("fast-transition");
          progressIn.style.width = targetWidth;
          animationTimeout = null;
        }, 500); // Wait for 0.5s transition to complete
      });
      
      item.addEventListener("mouseleave", function() {
        // Clear any pending animation
        if (animationTimeout) {
          clearTimeout(animationTimeout);
          animationTimeout = null;
        }
        // Keep at current value when mouse leaves
        progressIn.classList.remove("fast-transition");
        progressIn.style.width = targetWidth;
      });
    }
  });
}

// Initialize on DOM ready and also when About section becomes active
function setupProgressBars() {
  // Initial setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initProgressBarAnimation, 100);
    });
  } else {
    setTimeout(initProgressBarAnimation, 100);
  }
  
  // Re-initialize when About section becomes active
  const aboutSection = document.querySelector("#about");
  if (aboutSection) {
    const observer = new MutationObserver(() => {
      if (aboutSection.classList.contains('active')) {
        setTimeout(initProgressBarAnimation, 200);
      }
    });
    
    observer.observe(aboutSection, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

// Start setup
setupProgressBars();

// Projects Filter and View All functionality
function initProjectsFilter() {
  const projectsSection = document.querySelector("#projects");
  if (!projectsSection) return;

  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".projects-item");
  const viewAllBtn = document.getElementById("viewAllBtn");
  
  if (projectItems.length === 0) return;

  let isExpanded = false;
  let currentFilter = "all";

  // Initially show only first 3 projects
  projectItems.forEach((item, index) => {
    if (index >= 3) {
      item.classList.add("hidden");
    }
  });

  // Filter functionality
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");
      
      currentFilter = btn.getAttribute("data-filter");
      isExpanded = false; // Reset expanded state when filtering
      
      // First, filter projects by category
      const filteredItems = [];
      projectItems.forEach((item) => {
        const category = item.getAttribute("data-category");
        // Support multiple categories (space-separated)
        const categories = category ? category.split(" ") : [];
        if (currentFilter === "all" || categories.includes(currentFilter)) {
          item.classList.remove("hidden");
          filteredItems.push(item);
        } else {
          item.classList.add("hidden");
        }
      });
      
      // Then, show only first 3 if not expanded
      if (!isExpanded) {
        filteredItems.forEach((item, index) => {
          if (index >= 3) {
            item.classList.add("hidden");
          }
        });
      }

      // Update view all button
      const totalVisible = filteredItems.length;

      if (viewAllBtn) {
        if (totalVisible > 3) {
          viewAllBtn.style.display = "inline-flex";
          viewAllBtn.innerHTML = 'View All <i class="fa fa-arrow-down"></i>';
          viewAllBtn.classList.remove("expanded");
        } else {
          viewAllBtn.style.display = "none";
        }
      }
    });
  });

  // View All functionality
  if (viewAllBtn) {
    viewAllBtn.addEventListener("click", () => {
      isExpanded = !isExpanded;
      
      if (isExpanded) {
        // Show all projects matching current filter
        projectItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          // Support multiple categories (space-separated)
          const categories = category ? category.split(" ") : [];
          if (currentFilter === "all" || categories.includes(currentFilter)) {
            item.classList.remove("hidden");
          }
        });
        viewAllBtn.innerHTML = 'View Less <i class="fa fa-arrow-up"></i>';
        viewAllBtn.classList.add("expanded");
      } else {
        // Show only first 3 projects matching current filter
        let visibleCount = 0;
        projectItems.forEach((item) => {
          const category = item.getAttribute("data-category");
          // Support multiple categories (space-separated)
          const categories = category ? category.split(" ") : [];
          if (currentFilter === "all" || categories.includes(currentFilter)) {
            if (visibleCount < 3) {
              item.classList.remove("hidden");
              visibleCount++;
            } else {
              item.classList.add("hidden");
            }
          }
        });
        viewAllBtn.innerHTML = 'View All <i class="fa fa-arrow-down"></i>';
        viewAllBtn.classList.remove("expanded");
      }
    });

    // Initially show view all button if there are more than 3 projects
    const totalProjects = projectItems.length;
    if (totalProjects > 3) {
      viewAllBtn.style.display = "inline-flex";
    } else {
      viewAllBtn.style.display = "none";
    }
  }
}

// Initialize projects filter on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsFilter);
} else {
  initProjectsFilter();
}

// Contact Form Submission
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  
  // EmailJS Configuration
  // Step 1: Go to https://dashboard.emailjs.com and create a free account
  // Step 2: Create an Email Service (Gmail recommended)
  // Step 3: Create an Email Template with these variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
  // Step 4: Get your Public Key from Integration page
  // Step 5: Replace the values below with your actual keys
  
  const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY', // Replace with your EmailJS Public Key
    serviceID: 'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
    templateID: 'YOUR_TEMPLATE_ID' // Replace with your EmailJS Template ID
  };
  
  // Initialize EmailJS if configured
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.publicKey);
  }
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const subject = document.getElementById('contactSubject');
    const message = document.getElementById('contactMessage');
    
    if (!name || !email || !subject || !message) {
      showNotification('Error: Form fields not found!', 'error');
      return;
    }
    
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const subjectValue = subject.value.trim();
    const messageValue = message.value.trim();
    
    // Validation
    if (!nameValue || !emailValue || !subjectValue || !messageValue) {
      showNotification('Please fill in all fields!', 'error');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      showNotification('Please enter a valid email address!', 'error');
      return;
    }
    
    // Disable submit button
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Try EmailJS if configured
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY' && 
        EMAILJS_CONFIG.serviceID !== 'YOUR_SERVICE_ID' && EMAILJS_CONFIG.templateID !== 'YOUR_TEMPLATE_ID') {
      
      const templateParams = {
        from_name: nameValue,
        from_email: emailValue,
        subject: subjectValue,
        message: messageValue,
        to_email: 'tonnyjansen0831@gmail.com'
      };
      
      emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, templateParams)
        .then(function(response) {
          showNotification('Message sent successfully! I will get back to you soon.', 'success');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }, function(error) {
          console.error('EmailJS error:', error);
          // Fallback to FormSubmit
          submitViaFormSubmit(contactForm, submitBtn, originalBtnText);
        });
    } else {
      // Use FormSubmit (works immediately, no setup required)
      submitViaFormSubmit(contactForm, submitBtn, originalBtnText);
    }
  });
}

// Submit form via FormSubmit (free service, no setup required)
function submitViaFormSubmit(form, submitBtn, originalBtnText) {
  // Add hidden input for FormSubmit configuration
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.name = '_captcha';
  hiddenInput.value = 'false';
  form.appendChild(hiddenInput);
  
  const hiddenInput2 = document.createElement('input');
  hiddenInput2.type = 'hidden';
  hiddenInput2.name = '_template';
  hiddenInput2.value = 'box';
  form.appendChild(hiddenInput2);
  
  const hiddenInput3 = document.createElement('input');
  hiddenInput3.type = 'hidden';
  hiddenInput3.name = '_next';
  hiddenInput3.value = window.location.href + '?success=true';
  form.appendChild(hiddenInput3);
  
  // Submit the form
  const formData = new FormData(form);
  
  fetch(form.action, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      showNotification('Message sent successfully! I will get back to you soon.', 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      
      // Remove hidden inputs
      form.removeChild(hiddenInput);
      form.removeChild(hiddenInput2);
      form.removeChild(hiddenInput3);
    } else {
      throw new Error('Form submission failed');
    }
  })
  .catch(error => {
    console.error('FormSubmit error:', error);
    showNotification('Failed to send message. Please try again or contact directly at tonnyjansen0831@gmail.com', 'error');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
    
    // Remove hidden inputs
    if (form.contains(hiddenInput)) form.removeChild(hiddenInput);
    if (form.contains(hiddenInput2)) form.removeChild(hiddenInput2);
    if (form.contains(hiddenInput3)) form.removeChild(hiddenInput3);
  });
}

// Notification function
function showNotification(message, type = 'success') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide and remove after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

// Initialize contact form on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

// Project Modal Functionality
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const currentImageSpan = document.getElementById('currentImage');
  const totalImagesSpan = document.getElementById('totalImages');
  
  if (!modal) return;
  
  let currentImages = [];
  let currentImageIndex = 0;
  
  // Open modal function
  function openModal(images, title, description) {
    currentImages = images;
    currentImageIndex = 0;
    totalImagesSpan.textContent = currentImages.length;
    updateModalImage();
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close modal function
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentImages = [];
    currentImageIndex = 0;
  }
  
  // Update modal image
  function updateModalImage() {
    if (currentImages.length > 0) {
      modalImage.src = currentImages[currentImageIndex];
      currentImageSpan.textContent = currentImageIndex + 1;
      
      // Show/hide navigation buttons
      if (currentImages.length <= 1) {
        modalPrev.style.display = 'none';
        modalNext.style.display = 'none';
      } else {
        modalPrev.style.display = 'flex';
        modalNext.style.display = 'flex';
      }
    }
  }
  
  // Next image
  function nextImage() {
    if (currentImages.length > 0) {
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      updateModalImage();
    }
  }
  
  // Previous image
  function prevImage() {
    if (currentImages.length > 0) {
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      updateModalImage();
    }
  }
  
  // Event listeners for view buttons
  const viewButtons = document.querySelectorAll('.project-view-btn');
  viewButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const images = JSON.parse(this.getAttribute('data-images') || '[]');
      const title = this.getAttribute('data-title') || 'Project';
      const description = this.getAttribute('data-description') || '';
      
      if (images.length > 0) {
        openModal(images, title, description);
      }
    });
  });
  
  // Close modal events
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close on overlay click
  const modalOverlay = modal.querySelector('.modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }
  
  // Navigation buttons
  if (modalPrev) {
    modalPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      prevImage();
    });
  }
  
  if (modalNext) {
    modalNext.addEventListener('click', function(e) {
      e.stopPropagation();
      nextImage();
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (modal.classList.contains('active')) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    }
  });
}

// Initialize project modal on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectModal);
} else {
  initProjectModal();
}