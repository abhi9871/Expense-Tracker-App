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
            toastr.success(response.data.message);
            loginForm.reset();
        }
        else{
            toastr.error(response.data.message);
        }
    } catch (err) {
        const error = err.response.data.message;
        toastr.error(error);
    }
}