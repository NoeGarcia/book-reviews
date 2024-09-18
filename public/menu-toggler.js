document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    
    navToggle.addEventListener('click', function() {
        // Toggle the 'show' class on the nav-links div
        navLinks.classList.toggle('show');
    });
});