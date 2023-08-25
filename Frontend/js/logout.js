const logoutBtn = document.getElementById('logout-link');

logoutBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default click behavior
    
    // Remove the token from local storage (replace 'your_token_key' with the actual key)
    localStorage.removeItem('token');
    
    // Redirect the user to the login page
    window.location.href = '../html/login.html';
});