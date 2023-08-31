const dailyExpenseBtn = document.getElementById('daily');
const monthlyExpenseBtn = document.getElementById('monthly');
const yearlyExpenseBtn = document.getElementById('yearly');
const expenseTableBody = document.getElementById('expense-table-body');
const footerTotal = document.getElementById('footer-total');
const footerAmount = document.getElementById('footer-amount');
const token = localStorage.getItem('token');

// Decoding a token to obtain user's information whether he/she is a premium user or not
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Allow only premium users
function allowPremiumFeature() {
    const leaderBoard = document.getElementById('leaderboard');
    leaderBoard.addEventListener('click', (e) => {
        e.preventDefault();
        const decodeToken = parseJwt(token);
        if(decodeToken.isPremiumUser){
            window.location.href = 'http://127.0.0.1:5500/Frontend/html/leaderboard.html';
        } else {
            toastr.warning('You are not a premium user');
        }
    })
}

allowPremiumFeature();

async function showExpensesOnScreen() {
    try {
       const response = await axios.get('http://localhost:5000/expense/get-expenses', { headers: { "Authorization": token } });
       const expenses = response.data.data;
       const totalAmount = 0;
       expenses.forEach(expense => {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const categoryCell = document.createElement('td');
        const descriptionCell = document.createElement('td');
        const amountCell = document.createElement('td');

        // Retrieving the date and store it in a variable
        const expenseCreatedDate = expense.createdAt;

        // Convert the string to a Date object
        const date = new Date(expenseCreatedDate);

        // Get individual components (year, month, day)
        const day = date.getDate();
        const month = date.getMonth() + 1;  // Month is 0-indexed, so we add 1
        const year = date.getFullYear();

        const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;

        dateCell.textContent = formattedDate;
        categoryCell.textContent = expense.category;
        descriptionCell.textContent = expense.description;
        amountCell.innerHTML = `<span>&#8377;</span>${expense.amount}`;
        totalAmount += Number(expense.amount);

        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(descriptionCell);
        row.appendChild(amountCell);

        expenseTableBody.appendChild(row);
       });
       // Show total amount based on daily, weekly, and monthly at the footer of the table
       footerTotal.textContent = 'Total Amount';
       footerAmount.textContent = totalAmount;

    } catch (err) {
        console.log(err);
    }
}

// Show premium user tag who purchase premium
function showPremiumUser(isPremiumUser) {
    //Check whether an user is a premium user or not
    if(isPremiumUser){
        const purchaseMembershipBtn = document.getElementById("purchase-membership");
        const message = document.getElementById("premium-msg"); 
        purchaseMembershipBtn.style.display = 'none';
        message.style.display = 'block';
        message.textContent = 'Premium User';
    } else {
        // Checking condition according to the buying premium
        purchaseMembershipBtn.style.display = 'block';
    }
}

// Fetching the user while refreshing the page
window.addEventListener('DOMContentLoaded', async () => {
    const decodedToken = parseJwt(token);
    let isPremiumUser = decodedToken.isPremiumUser;
    //Check whether an user is a premium user or not on reload
    showPremiumUser(isPremiumUser);
});