document.addEventListener('DOMContentLoaded', () => {
    const lightbox = document.getElementById('lightbox');
    const zoomImg = document.getElementById('zoom-img');
    const closeBtn = document.getElementById('close-lightbox');
    const tutorialImages = document.querySelectorAll('.tutorial-image');

    let scale = 1;
    let x = 0;
    let y = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;

    function updateTransform() {
        zoomImg.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    }

    function openLightbox(src) {
        zoomImg.src = src;
        lightbox.style.display = 'flex';

        // Reset to initial centered state
        scale = 0.8;
        x = 0;
        y = 0;

        // Wait for image to load to center it properly if needed, 
        // but translate(0,0) with flex center usually works
        zoomImg.onload = () => {
            x = 0;
            y = 0;
            updateTransform();
        };

        updateTransform();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    tutorialImages.forEach(img => {
        img.addEventListener('click', () => {
            openLightbox(img.src);
        });
    });

    closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Mouse Centered Zoom Logic
    lightbox.addEventListener('wheel', (e) => {
        e.preventDefault();

        const zoomSpeed = 0.1;
        const delta = e.deltaY > 0 ? -1 : 1;
        const factor = Math.pow(1.1, delta);

        const newScale = Math.min(Math.max(0.1, scale * factor), 10);

        // Calculate mouse position relative to image center
        const rect = zoomImg.getBoundingClientRect();
        const mouseX = e.clientX - (window.innerWidth / 2 + x);
        const mouseY = e.clientY - (window.innerHeight / 2 + y);

        // Adjustment to keep mouse over the same point on image
        if (newScale !== scale) {
            const ratio = newScale / scale;
            x -= mouseX * (ratio - 1);
            y -= mouseY * (ratio - 1);
            scale = newScale;
        }

        updateTransform();
    }, { passive: false });

    // Drag to Pan Logic
    lightbox.addEventListener('mousedown', (e) => {
        if (e.target === zoomImg) {
            isDragging = true;
            startX = e.clientX - x;
            startY = e.clientY - y;
            zoomImg.style.transition = 'none'; // Disable transition during drag
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging) {
            x = e.clientX - startX;
            y = e.clientY - startY;
            updateTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
        zoomImg.style.transition = 'transform 0.1s ease-out';
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});
