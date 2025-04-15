document.addEventListener('DOMContentLoaded', function() {
    // Initialize player elements
    const playBtn = document.querySelector('.play-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const libraryItems = document.querySelectorAll('.library-item');
    const progressBar = document.querySelector('.progress-bar');
    const volumeSlider = document.querySelector('.volume-slider-fill');
    const disc = document.querySelector('.disc');
    const libraryNameDisplay = document.getElementById('library-name');
    
    // Player state
    let isPlaying = false;
    let currentVolume = 70; // percentage
    
    // Library data (simplified for demo)
    const libraries = [
        { name: "JAZZ COLLECTION", cover: "jazz.png" },
        { name: "SOUL CLASSICS", cover: "soul.png" },
        { name: "GOLDEN OLDIES", cover: "golden.png" },
        { name: "VINYL TREASURES", cover: "vinyl.png" }
    ];
    
    // Initialize the disc with the current library name
    updateLibraryName();
    
    // Library item click handlers
    libraryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Update active library
            libraryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update the library name on the disc
            updateLibraryName();
            
            // Update the now playing cover
            const coverImg = item.getAttribute('data-cover');
            document.querySelector('.now-playing-cover').style.backgroundImage = `url('assets/${coverImg}')`;
        });
    });
    
    // Function to update library name on the disc
    function updateLibraryName() {
        const activeLibrary = document.querySelector('.library-item.active');
        const libraryName = activeLibrary.querySelector('h3').textContent;
        libraryNameDisplay.textContent = libraryName;
    }
    
    // Playlist item click handlers
    playlistItems.forEach(item => {
        item.addEventListener('click', () => {
            playlistItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Update now playing info
            const title = item.querySelector('h3').textContent;
            const artist = item.querySelector('p').textContent.split('·')[0].trim();
            
            document.querySelector('.now-playing-info h3').textContent = title;
            document.querySelector('.now-playing-info p').textContent = artist;
            
            // Reset progress
            progressBar.style.width = '0%';
            document.querySelector('.current-time').textContent = '0:00';
            
            // If already playing, continue playing new track
            if (isPlaying) {
                simulatePlayback();
            }
        });
    });
    
    // Play/Pause button click
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        
        if (isPlaying) {
            playBtn.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M2.7 1a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7H2.7zm8 0a.7.7 0 00-.7.7v12.6a.7.7 0 00.7.7h2.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-2.6z"/>
                </svg>
            `;
            disc.style.animationPlayState = 'running';
            simulatePlayback();
            startMusicNotesAnimation();
        } else {
            playBtn.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M4.5 13.5C4.5 14.3 5.2 15 6 15c.2 0 .4 0 .5-.1l6.5-3.5c.5-.3.9-.8.9-1.4 0-.6-.4-1.1-.9-1.4L7 5.1c-.2-.1-.4-.1-.6-.1-.8 0-1.5.7-1.5 1.5v7z"/>
                </svg>
            `;
            disc.style.animationPlayState = 'paused';
        }
    });
    
    // Previous button click
    prevBtn.addEventListener('click', () => {
        const activeItem = document.querySelector('.playlist-item.active');
        const prevItem = activeItem.previousElementSibling || 
                        playlistItems[playlistItems.length - 1];
        
        activeItem.classList.remove('active');
        prevItem.classList.add('active');
        updateNowPlaying(prevItem);
        resetPlayback();
    });
    
    // Next button click
    nextBtn.addEventListener('click', playNext);
    
    function playNext() {
        const activeItem = document.querySelector('.playlist-item.active');
        const nextItem = activeItem.nextElementSibling || playlistItems[0];
        
        activeItem.classList.remove('active');
        nextItem.classList.add('active');
        updateNowPlaying(nextItem);
        resetPlayback();
    }
    
    // Update now playing info
    function updateNowPlaying(item) {
        const title = item.querySelector('h3').textContent;
        const artist = item.querySelector('p').textContent.split('·')[0].trim();
        
        document.querySelector('.now-playing-info h3').textContent = title;
        document.querySelector('.now-playing-info p').textContent = artist;
        
        // We would update the cover image here, but we'll keep it simple for this demo
        // and use the library cover instead
    }
    
    // Reset playback
    function resetPlayback() {
        progressBar.style.width = '0%';
        document.querySelector('.current-time').textContent = '0:00';
        
        if (isPlaying) {
            simulatePlayback();
        }
    }
    
    // Simulate playback progress
    function simulatePlayback() {
        if (!isPlaying) return;
        
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100 || !isPlaying) {
                clearInterval(interval);
                if (width >= 100) {
                    playNext();
                }
                return;
            }
            
            width += 0.5;
            progressBar.style.width = `${width}%`;
            
            // Update time display
            const totalSeconds = 182; // 3:02 in seconds
            const currentSeconds = Math.floor(totalSeconds * (width / 100));
            const minutes = Math.floor(currentSeconds / 60);
            const seconds = currentSeconds % 60;
            
            document.querySelector('.current-time').textContent = 
                `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }, 1000);
    }
    
    // Volume control
    const volumeContainer = document.querySelector('.volume-slider-container');
    
    volumeContainer.addEventListener('click', (e) => {
        const rect = volumeContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const containerWidth = rect.width;
        
        currentVolume = Math.min(Math.max(0, Math.round((clickX / containerWidth) * 100)), 100);
        volumeSlider.style.width = `${currentVolume}%`;
        
        console.log(`Volume set to ${currentVolume}%`);
    });
    
    // Progress bar click for seeking
    const progressContainer = document.querySelector('.progress-bar-container');
    
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const containerWidth = rect.width;
        
        const seekPercentage = Math.min(Math.max(0, Math.round((clickX / containerWidth) * 100)), 100);
        progressBar.style.width = `${seekPercentage}%`;
        
        // Update time display when seeking
        const totalSeconds = 182; // 3:02 in seconds
        const currentSeconds = Math.floor(totalSeconds * (seekPercentage / 100));
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        
        document.querySelector('.current-time').textContent = 
            `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        
        console.log(`Seek to ${seekPercentage}%`);
    });
    
    // Music notes animation
    function createMusicNote(container, x, y) {
        const note = document.createElement('div');
        note.classList.add('music-note');
        
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
        
        note.addEventListener('animationend', () => {
            note.remove();
        });
    }
    
    let musicNotesInterval;
    
    function startMusicNotesAnimation() {
        if (musicNotesInterval) clearInterval(musicNotesInterval);
        
        musicNotesInterval = setInterval(() => {
            if (!isPlaying) {
                clearInterval(musicNotesInterval);
                return;
            }
            
            const container = document.getElementById('music-notes-container');
            const disc = document.querySelector('.disc-container');
            const discRect = disc.getBoundingClientRect();
            const centerX = discRect.left + discRect.width / 2;
            const centerY = discRect.top + discRect.height / 2;
            
            createMusicNote(container, centerX, centerY);
        }, 800);
    }
    
    // Initialize like button
    const likeButton = document.querySelector('.like-button');
    let isLiked = false;
    
    likeButton.addEventListener('click', () => {
        isLiked = !isLiked;
        
        if (isLiked) {
            likeButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="#d4a762" d="M8 3.1c1.5-2.1 7.2-1.7 7.2 2.4 0 3.1-3.9 5.8-7.2 9-3.3-3.2-7.2-5.9-7.2-9 0-4.1 5.8-4.4 7.2-2.4z"/>
                </svg>
            `;
        } else {
            likeButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16">
                    <path fill="currentColor" d="M8 3.1c1.5-2.1 7.2-1.7 7.2 2.4 0 3.1-3.9 5.8-7.2 9-3.3-3.2-7.2-5.9-7.2-9 0-4.1 5.8-4.4 7.2-2.4z"/>
                </svg>
            `;
        }
    });
});