const expenseForm = document.getElementById('expense-form');
const expenseTableBody = document.getElementById('expense-table-body');
const expenseBtn = document.getElementById('expense-btn');
let isEdit = false; // Flag to check whether the expense needs to update or not.
const token = localStorage.getItem('token');

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

    // To show success notification when user successfully login
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if(isAuthenticated){
        toastr.success('Login Successful');
        localStorage.setItem('isAuthenticated', false);
    }

// Add an event listener to the form
expenseForm.addEventListener('submit', submitExpenseDetails);

 function submitExpenseDetails(e) {
    e.preventDefault(); // Prevent form submission to avoid page refresh
    const category = document.getElementById('category');
    const description = document.getElementById('description');
    const amount = document.getElementById('amount');

    // Expense details object
    const expenseDetails = {
        category: category.value,
        description: description.value,
        amount: amount.value
    }

        if(isEdit){
            const expenseId = expenseForm.getAttribute('expense-id');
            const tr = document.getElementById(expenseId);
            tr.children[1].textContent = expenseDetails.category;
            tr.children[2].textContent = expenseDetails.description;
            tr.children[3].innerHTML = `<span>&#8377;</span>${expenseDetails.amount}`;
            updateExpense(expenseId, expenseDetails);
        }
        else{
            addExpense(expenseDetails);
        }
        expenseForm.reset();
}

// Show expense details on user screen
function expenseDetailsOnScreen(expenseData) {

    // Creating a dynamic table data to show 
    const tr = document.createElement('tr');

    // Set an id attribute for tr element
    tr.setAttribute('id', expenseData.id);

    const dateCell = document.createElement('td');
    const categoryCell = document.createElement('td');
    const descriptionCell = document.createElement('td');
    const amountCell = document.createElement('td');
    const actionBtns = document.createElement('td');

    // Retrieving the date and store it in a variable
    const createdAtValue = expenseData.createdAt;

    // Convert the string to a Date object
    const date = new Date(createdAtValue);

    // Get individual components (year, month, day)
    const day = date.getDate();
    const month = date.getMonth() + 1;  // Month is 0-indexed, so we add 1
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

    dateCell.textContent = formattedDate;
    categoryCell.textContent = expenseData.category;
    descriptionCell.textContent = expenseData.description;
    amountCell.innerHTML = `<span>&#8377;</span>${expenseData.amount}`;

    // Create an edit icon to update the expense
    const editIcon = document.createElement('i');
    editIcon.className = 'bi bi-pencil-square table-heading p-2';
    editIcon.style.cursor = 'pointer';
    actionBtns.appendChild(editIcon);

    // Add an event listener to the editIcon for editing the expense
    editIcon.addEventListener('click', (e) => {
        const tr = e.target.parentElement.parentElement;
        const expenseId = tr.getAttribute('id');
        expenseForm.setAttribute('expense-id', expenseId);
        getExpense(expenseId);
    })

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'bi bi-trash table-heading mx-2';
    deleteIcon.style.cursor = 'pointer';
    actionBtns.appendChild(deleteIcon);

    // Add an event listener to the deleteIcon for deleting the expense
    deleteIcon.addEventListener('click', (e) => {
        const tr = e.target.parentElement.parentElement;
        const expenseId = tr.getAttribute('id');
        expenseTableBody.removeChild(tr);
        deleteExpense(expenseId);
    })

    tr.appendChild(dateCell);
    tr.appendChild(categoryCell);
    tr.appendChild(descriptionCell);
    tr.appendChild(amountCell);
    tr.appendChild(actionBtns);

    expenseTableBody.appendChild(tr);

}

// Create an expense function
async function addExpense(expenseDataObj) {
    try{
        const response = await axios.post('http://localhost:5000/expense/create-expense', expenseDataObj, { headers: { "Authorization": `${token}` }});
        if(response.data.success){
        const expenseData = response.data.data;
        expenseDetailsOnScreen(expenseData);
        }
    } catch(err) {
        const error = err.response.data.message;
        toastr.error(error);
        console.log(err);
    }
}

async function getExpense(expenseId) {
    try{
        const response = await axios.get(`http://localhost:5000/expense/get-expense/${expenseId}`, { headers: { "Authorization": token } });
        if(response.data.success){
            isEdit = true;
            const expense = response.data.data;
            const category = document.getElementById('category');
            const description = document.getElementById('description');
            const amount = document.getElementById('amount');
            category.value = expense.category;
            description.value = expense.description;
            amount.value = expense.amount;

            //Changing the button value add to update expense
            if(isEdit)
                expenseBtn.textContent = 'Update Expense';
        }   
    } catch(err) {
        const error = err.response.data.message;
        toastr.error(error);
        console.log(err);
    }
}

// Get all the expenses function
async function getExpenses() {
    try{
        const response = await axios.get('http://localhost:5000/expense/get-expenses', { headers: { "Authorization": token } });
        if(response.data.success){
            const expenseData = response.data.data;
            expenseData.forEach((expense) => {
                expenseDetailsOnScreen(expense);
            })
        }   
    } catch(err) {
        const error = err.response.data.message;
        toastr.error(error);
        console.log(err);
    }
}

// Update an expense function
async function updateExpense(expenseId, expenseData) {
    try{
        const response = await axios.put(`http://localhost:5000/expense/edit-expense/${expenseId}`, expenseData, { headers: { "Authorization": `${token}` }});
        if(response.data.success){
            const expenseData = response.data;
            toastr.success(expenseData.message);
            isEdit = false;
            if(!isEdit)
                expenseBtn.textContent = 'Add Expense';
        }     
    } catch(err) {
        const error = err.response.data.message;
        toastr.error(error);
        console.log(err);
    }
}

// Delete an expense function
async function deleteExpense(expenseId) {
    try{
        const response = await axios.delete(`http://localhost:5000/expense/delete-expense/${expenseId}`, { headers: { "Authorization": `${token}` }});
        if(response.data.success){
            const expenseData = response.data;
            toastr.success(expenseData.message);
        }
    } catch(err) {
        const error = err.response.data.message;
        toastr.error(error);
        console.log(err);
    }
}

// Fetching the data while refreshing the page
window.addEventListener('DOMContentLoaded', getExpenses);
