// Slider JavaScript
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let autoSlideInterval;

// Initialize slider
function initSlider() {
  showSlide(currentSlideIndex);
  startAutoSlide();
}

// Show specific slide
function showSlide(index) {
  // Remove active class from all slides and dots
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));
  
  // Add active class to current slide and dot
  slides[index].classList.add('active');
  dots[index].classList.add('active');
}

// Change slide function
function changeSlide(direction) {
  currentSlideIndex += direction;
  
  // Loop back to beginning or end
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  
  showSlide(currentSlideIndex);
  resetAutoSlide();
}

// Go to specific slide
function currentSlide(index) {
  currentSlideIndex = index - 1;
  showSlide(currentSlideIndex);
  resetAutoSlide();
}

// Auto slide functionality
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    changeSlide(1);
  }, 5000); // Change slide every 5 seconds
}

// Reset auto slide timer
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Pause auto slide on hover
function pauseAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Resume auto slide when not hovering
function resumeAutoSlide() {
  startAutoSlide();
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
  touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
}

function handleSwipe() {
  const swipeThreshold = 50;
  const diff = touchStartX - touchEndX;
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next slide
      changeSlide(1);
    } else {
      // Swipe right - previous slide
      changeSlide(-1);
    }
  }
}

// Keyboard navigation
function handleKeyPress(event) {
  switch(event.key) {
    case 'ArrowLeft':
      changeSlide(-1);
      break;
    case 'ArrowRight':
      changeSlide(1);
      break;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const sliderContainer = document.querySelector('.slider-container');
  
  if (sliderContainer) {
    initSlider();
    
    // Add event listeners
    sliderContainer.addEventListener('mouseenter', pauseAutoSlide);
    sliderContainer.addEventListener('mouseleave', resumeAutoSlide);
    sliderContainer.addEventListener('touchstart', handleTouchStart);
    sliderContainer.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyPress);
  }
});