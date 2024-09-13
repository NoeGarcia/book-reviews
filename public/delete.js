document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete-link').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent the default link behavior
            var bookId = this.getAttribute('data-id');
            var deleteForm = document.getElementById('delete-form');
            var confirmDelete = confirm('Are you sure you want to delete this book?');

            if (confirmDelete) {
                deleteForm.action = '/books/' + bookId +"?_method=DELETE"; // Set the action URL of the form
                deleteForm.submit(); // Submit the form
            }
        });
    });
});