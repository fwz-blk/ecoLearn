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