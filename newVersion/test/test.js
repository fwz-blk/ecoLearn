// Map nav links text to section classes
const sectionMap = {
  'Home': '.hero-section1',
  'Features': '.feature-section',
  'About': '.about-section'
};

// Select all nav links
const navLinks = document.querySelectorAll('.nav-links');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault(); // prevent default jump
    const linkText = link.textContent.trim(); // get link text
    const sectionClass = sectionMap[linkText]; // find corresponding section
    const targetSection = document.querySelector(sectionClass);

    if (targetSection) {
      // Smooth scroll to the section
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// code for student login button 

// Get all the elements
const studentBtn = document.getElementById('studentLoginBtn');
// const teacherBtn = document.getElementById('teacherLoginBtn');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('loginModal');
const closeBtn = document.querySelector('.close-btn');

// OPEN modal when button clicked
studentBtn.addEventListener('click', function() {
  overlay.classList.add('active'); // Show blur overlay
  modal.classList.add('active');   // Show modal
});

// CLOSE modal when X is clicked
closeBtn.addEventListener('click', function() {
  overlay.classList.remove('active'); // Hide overlay
  modal.classList.remove('active');   // Hide modal
});

// CLOSE modal when clicking outside (on overlay)
overlay.addEventListener('click', function() {
  overlay.classList.remove('active');
  modal.classList.remove('active');
});

// Teacher Login Modal
const teacherBtn = document.getElementById('teacherLoginBtn');
const teacherModal = document.getElementById('teacherModal');
const teacherCloseBtn = document.querySelector('.teacher-close');

// OPEN teacher modal
teacherBtn.addEventListener('click', function() {
  overlay.classList.add('active');
  teacherModal.classList.add('active');
});

// CLOSE teacher modal when X is clicked
teacherCloseBtn.addEventListener('click', function() {
  overlay.classList.remove('active');
  teacherModal.classList.remove('active');
});

// Overlay click should close ANY open modal
overlay.addEventListener('click', function() {
  overlay.classList.remove('active');
  modal.classList.remove('active');         // Student modal
  teacherModal.classList.remove('active');  // Teacher modal
});