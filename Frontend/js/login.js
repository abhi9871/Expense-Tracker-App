const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', logIn);

// Initialize Toastr options
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut"
};

// Login function
async function logIn(e) {
    e.preventDefault();
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    // Login credentials object
    const credentials = {
        email: email.value,
        password: password.value
    }
    try {
        const response = await axios.post('http://localhost:5000/user/login', credentials);
        if(response.data.success){ 
            loginForm.reset();
            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('isAuthenticated', true);
            window.location.href = 'http://127.0.0.1:5500/Frontend/html/home.html';
        }
    } catch (err) {
        const error = err.response.data.message;
        toastr.error(error);
        loginForm.reset();
    }
}