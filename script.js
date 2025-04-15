document.addEventListener('DOMContentLoaded', function() {
  // Create dust particles
  const dustContainer = document.getElementById('dust');
  
  for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.classList.add('dust-particle');
      
      // Random positioning
      const left = Math.random() * 100;
      particle.style.left = `${left}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random size
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random animation duration and delay
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;
      particle.style.animation = `drift ${duration}s ${delay}s linear infinite`;
      
      dustContainer.appendChild(particle);
  }
  
  // Initialize GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Animate elements when they come into view
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(element => {
      gsap.fromTo(element, 
          { y: 50, opacity: 0 }, 
          { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              scrollTrigger: {
                  trigger: element,
                  start: "top 80%",
                  toggleActions: "play none none none"
              }
          }
      );
  });
  
  const scaleElements = document.querySelectorAll('.scale-in');
  scaleElements.forEach(element => {
      gsap.fromTo(element, 
          { scale: 0.8, opacity: 0 }, 
          { 
              scale: 1, 
              opacity: 1, 
              duration: 0.8, 
              scrollTrigger: {
                  trigger: element,
                  start: "top 80%",
                  toggleActions: "play none none none"
              }
          }
      );
  });

  // Add vinyl record animation (modified to support music notes)
  const vinylImage = document.querySelector('.vinyl-image');
  const discContainer = document.querySelector('.disc-container');
  
  // Continuous slow rotation
  gsap.to(discContainer, {
      rotation: 360,
      duration: 20,
      ease: "linear",
      repeat: -1,
      onUpdate: function() {
          // Disc is rotating, notes can be emitted here too when playing
          if (isPlaying && Math.random() > 0.98) {
              const notesContainer = document.getElementById('music-notes-container');
              const discRect = discContainer.getBoundingClientRect();
              const centerX = discRect.left + discRect.width / 2;
              const centerY = discRect.top + discRect.height / 2;
              createMusicNote(notesContainer, centerX, centerY, discRect.width * 0.4);
          }
      }
  });
  
  // Animate the tonearm when scrolling to the hero section
  gsap.to('.tonearm', {
      rotation: 0,
      duration: 2,
      delay: 1,
      ease: "back.out(1.7)"
  });
  
  // Setup testimonial slider
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.slider-dot');
  const testimonials = document.querySelectorAll('.testimonial');
  let currentIndex = 0;
  
  function goToSlide(index) {
      track.style.transform = `translateX(-${index * 100}%)`;
      
      // Update active dot
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');
      
      currentIndex = index;
  }
  
  // Add click event to dots
  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          goToSlide(index);
      });
  });
  
  // Auto advance slider
  setInterval(() => {
      let nextIndex = (currentIndex + 1) % testimonials.length;
      goToSlide(nextIndex);
  }, 5000);
  
  // Audio player controls
  const progressBar = document.querySelector('.progress-bar');
  const playBtn = document.querySelector('.play-btn');
  let isPlaying = false;
  
  playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      playBtn.innerHTML = isPlaying ? '<i class="fas">&#x23F8;</i>' : '<i class="fas">&#x23F5;</i>';
      
      if (isPlaying) {
          // Play animation
          vinylImage.style.animationPlayState = 'running';
          
          // Animate progress bar when playing
          gsap.to(progressBar, {
              width: '100%',
              duration: 30,
              ease: "linear"
          });
          
          // Make the vinyl spin faster
          gsap.to(discContainer, {
              timeScale: 2,
              duration: 1
          });
          
          // Start emitting notes
          startNoteEmission(document.getElementById('music-notes-container'), discContainer);
      } else {
          // Pause animation
          vinylImage.style.animationPlayState = 'paused';
          
          // Pause progress bar animation
          gsap.killTweensOf(progressBar);
          
          // Slow down the vinyl spin
          gsap.to(discContainer, {
              timeScale: 0.5,
              duration: 1
          });
      }
  });
  
  // Progress bar click functionality
  const progressContainer = document.querySelector('.progress-container');
  progressContainer.addEventListener('click', (e) => {
      const clickPosition = e.offsetX / progressContainer.offsetWidth;
      progressBar.style.width = `${clickPosition * 100}%`;
      
      if (isPlaying) {
          gsap.killTweensOf(progressBar);
          gsap.to(progressBar, {
              width: '100%',
              duration: 30 * (1 - clickPosition),
              ease: "linear"
          });
      }
  });
  
  // Add side control button functionality
  const prevBtn = document.querySelectorAll('.control-btn')[0];
  const nextBtn = document.querySelectorAll('.control-btn')[2];
  
  prevBtn.addEventListener('click', () => {
      // Reset progress
      progressBar.style.width = '0';
      
      if (isPlaying) {
          gsap.killTweensOf(progressBar);
          gsap.to(progressBar, {
              width: '100%',
              duration: 30,
              ease: "linear"
          });
      }
      
      // Visual effect for skipping back
      gsap.to(discContainer, {
          rotation: '-=30',
          duration: 0.3,
          ease: "power1.out"
      });
  });
  
  nextBtn.addEventListener('click', () => {
      // Reset progress
      progressBar.style.width = '0';
      
      if (isPlaying) {
          gsap.killTweensOf(progressBar);
          gsap.to(progressBar, {
              width: '100%',
              duration: 30,
              ease: "linear"
          });
      }
      
      // Visual effect for skipping forward
      gsap.to(discContainer, {
          rotation: '+=30',
          duration: 0.3,
          ease: "power1.out"
      });
  });
  
  // Add slide-in animations for hero content
  gsap.fromTo('.slide-in-left', 
      { x: -100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1, delay: 0.5 }
  );
  
  gsap.fromTo('.slide-in-right', 
      { x: 100, opacity: 0 }, 
      { x: 0, opacity: 1, duration: 1, delay: 0.5 }
  );
  
  // Add hover effects to showcase items
  const showcaseItems = document.querySelectorAll('.showcase-item');
  showcaseItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
          gsap.to(item, {
              y: -10,
              boxShadow: '0 15px 30px rgba(0,0,0,0.15)',
              duration: 0.3
          });
      });
      
      item.addEventListener('mouseleave', () => {
          gsap.to(item, {
              y: 0,
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              duration: 0.3
          });
      });
  });
  
  // Newsletter form submission
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          const emailInput = this.querySelector('input[type="email"]');
          if (emailInput.value) {
              // Simulating successful submission
              emailInput.value = '';
              alert('Thank you for subscribing to our newsletter!');
          }
      });
  }
  
  // Mobile navigation toggle
  const mobileBurger = document.querySelector('.mobile-burger') || document.createElement('div');
  if (!document.querySelector('.mobile-burger')) {
      mobileBurger.classList.add('mobile-burger');
      mobileBurger.innerHTML = '☰';
      document.querySelector('nav').appendChild(mobileBurger);
  }
  
  mobileBurger.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      navLinks.classList.toggle('show');
  });
  
  // Add smooth scrolling to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          if (this.getAttribute('href') === '#') return;
          
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
              window.scrollTo({
                  top: target.offsetTop - 80,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Initialize Three.js background effect for hero section
  // This is just a placeholder as the full implementation would be more complex
  function initThreeJsBackground() {
      try {
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          const renderer = new THREE.WebGLRenderer({ alpha: true });
          renderer.setSize(window.innerWidth, window.innerHeight);
          
          // Only append if Three.js is available
          if (document.getElementById('three-bg')) {
              document.getElementById('three-bg').appendChild(renderer.domElement);
          } else {
              const threeContainer = document.createElement('div');
              threeContainer.id = 'three-bg';
              threeContainer.style.position = 'absolute';
              threeContainer.style.top = '0';
              threeContainer.style.left = '0';
              threeContainer.style.zIndex = '-1';
              threeContainer.appendChild(renderer.domElement);
              document.querySelector('.hero').prepend(threeContainer);
          }
          
          // Rest of Three.js implementation would go here
      } catch (e) {
          console.log('Three.js visualization not available');
      }
  }
  
  // If Three.js is available, initialize background
  if (typeof THREE !== 'undefined') {
      initThreeJsBackground();
  }

  // ===== NEW AUTUMN AND MUSIC NOTE FEATURES =====

  // Create containers for leaves and music notes if they don't exist
  if (!document.getElementById('leaf-container')) {
      const leafContainer = document.createElement('div');
      leafContainer.id = 'leaf-container';
      leafContainer.classList.add('particle-container');
      document.body.prepend(leafContainer);
  }

  if (!document.getElementById('music-notes-container')) {
      const musicNotesContainer = document.createElement('div');
      musicNotesContainer.id = 'music-notes-container';
      musicNotesContainer.classList.add('particle-container');
      document.body.prepend(musicNotesContainer);
  }

  // Leaf animation system
  function initLeafSystem() {
      const leafContainer = document.getElementById('leaf-container');
      const maxLeaves = 25;
      
      // Create initial leaves
      for (let i = 0; i < maxLeaves / 2; i++) {
          createLeaf(leafContainer);
      }
      
      // Continue creating leaves at interval
      setInterval(() => {
          if (document.querySelectorAll('.leaf').length < maxLeaves) {
              createLeaf(leafContainer);
          }
      }, 800);
  }

  function createLeaf(container) {
      const leaf = document.createElement('div');
      leaf.classList.add('leaf');
      
      // Add color variety
      const colorClasses = ['orange', 'brown', 'yellow', 'red'];
      leaf.classList.add(colorClasses[Math.floor(Math.random() * colorClasses.length)]);
      
      // Set leaf starting position
      const startX = Math.random() * 100;
      leaf.style.left = `${startX}vw`;
      
      // Set leaf size variation
      const size = Math.random() * 15 + 15;
      leaf.style.width = `${size}px`;
      leaf.style.height = `${size}px`;
      
      // Set background image
      leaf.style.backgroundImage = `url('assets/leaf.png')`;
      
      // Set wind factor and physics
      const windFactor = Math.random() * 4 - 2;
      leaf.style.setProperty('--wind-factor', windFactor);
      
      // Set fall duration based on size (smaller leaves fall slower)
      const duration = Math.random() * 10 + 10;
      leaf.style.animationDuration = `${duration}s`;
      
      // Add to container
      container.appendChild(leaf);
      
      // Remove leaf after animation completes
      leaf.addEventListener('animationend', () => {
          leaf.remove();
      });
      
      // Add 3D rotation and swaying
      applyLeafPhysics(leaf);
  }

  function applyLeafPhysics(leaf) {
      // Initialize physics properties
      const rotationSpeed = Math.random() * 2 - 1;
      const swayAmplitude = Math.random() * 15 + 5;
      const swayFrequency = Math.random() * 5 + 3;
      let time = 0;
      
      // Animate leaf with physics
      function updateLeaf() {
          time += 0.01;
          
          // Simulate 3D motion
          const rotateX = Math.sin(time * swayFrequency) * 40;
          const rotateY = Math.cos(time * (swayFrequency * 0.7)) * 40;
          const rotateZ = rotationSpeed * time * 60;
          
          // Horizontal sway
          const translateX = Math.sin(time * swayFrequency) * swayAmplitude;
          
          // Apply transforms
          leaf.style.transform = `
              translateX(${translateX}px) 
              rotateX(${rotateX}deg) 
              rotateY(${rotateY}deg) 
              rotateZ(${rotateZ}deg)
          `;
          
          // Continue animation until leaf is removed
          if (!leaf.parentNode) return;
          requestAnimationFrame(updateLeaf);
      }
      
      requestAnimationFrame(updateLeaf);
  }

  // Music note emission system
  function startNoteEmission(container, discElement) {
      // Get disc position
      const discRect = discElement.getBoundingClientRect();
      const centerX = discRect.left + discRect.width / 2;
      const centerY = discRect.top + discRect.height / 2;
      const radius = discRect.width * 0.4;
      
      // Set interval for note emission
      const noteInterval = setInterval(() => {
          // Check if still playing
          if (!isPlaying) {
              clearInterval(noteInterval);
              return;
          }
          
          // Create note at random position on disc edge
          createMusicNote(container, centerX, centerY, radius);
      }, 500);
  }


  function createMusicNote(container, x, y) {
    const note = document.createElement('div');
    note.classList.add('music-note', 'vapor-effect'); // Add 'vapor-effect' class
    
    const notes = ['n1.png', 'n2.png', 'n3.png'];
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    note.style.backgroundImage = `url('assets/${randomNote}')`;
    
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    
    const size = Math.random() * 20 + 15;
    note.style.width = `${size}px`;
    note.style.height = `${size}px`;
    
    const floatX = (Math.random() - 0.5) * 100;
    const floatY = -(Math.random() * 100 + 50);
    note.style.setProperty('--note-x', `${floatX}px`);
    note.style.setProperty('--note-y', `${floatY}px`);
    
    container.appendChild(note);
    
    // Optional: Add randomness to timing
    note.style.animationDelay = `${Math.random() * 2}s`;  // Random start delay
    note.style.animationDuration = `${Math.random() * 3 + 3}s`;  // Randomize duration (between 3s and 6s)

    note.addEventListener('animationend', () => {
        note.remove();
    });
}

  // Add autumn overlay to record player
  function addAutumnOverlayToRecord() {
      const recordPlayer = document.querySelector('.record-player');
      if (!recordPlayer.querySelector('.autumn-overlay')) {
          const overlay = document.createElement('div');
          overlay.classList.add('autumn-overlay');
          recordPlayer.appendChild(overlay);
      }
  }

  // Add autumn-colored dust particles
  function addAutumnDustParticles() {
      const extraDustCount = 20;
      
      for (let i = 0; i < extraDustCount; i++) {
          const particle = document.createElement('div');
          particle.classList.add('dust-particle');
          
          // Random positioning
          const left = Math.random() * 100;
          particle.style.left = `${left}%`;
          particle.style.top = `${Math.random() * 100}%`;
          
          // Random size
          const size = Math.random() * 3 + 1;
          particle.style.width = `${size}px`;
          particle.style.height = `${size}px`;
          
          // Autumn colors
          const autumnColors = [
              'rgba(205, 92, 8, 0.3)',   // orange
              'rgba(191, 151, 66, 0.3)',  // yellow
              'rgba(125, 10, 10, 0.3)',   // red
              'rgba(92, 61, 20, 0.3)'     // brown
          ];
          
          particle.style.backgroundColor = autumnColors[Math.floor(Math.random() * autumnColors.length)];
          
          // Random animation duration and delay
          const duration = Math.random() * 15 + 10;
          const delay = Math.random() * 5;
          particle.style.animation = `drift ${duration}s ${delay}s linear infinite`;
          
          dustContainer.appendChild(particle);
      }
  }

  // Initialize autumn features
  initLeafSystem();
  addAutumnOverlayToRecord();
  addAutumnDustParticles();
  
  // Handle window resize for music note positioning
  window.addEventListener('resize', () => {
      // If music is playing, restart note emission with updated positions
      if (isPlaying) {
          const notesContainer = document.getElementById('music-notes-container');
          startNoteEmission(notesContainer, discContainer);
      }
  });
});