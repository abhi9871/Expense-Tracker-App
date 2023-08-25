const purchaseMembershipBtn = document.getElementById("purchase-membership");

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
  hideMethod: "fadeOut",
};

// Add event listener to the membership button
purchaseMembershipBtn.addEventListener("click", purchaseMembership);

async function purchaseMembership(e) {
  const token = localStorage.getItem("token");
  const response = await getOrderId(token);
  const order = response.data.data.order;
  const keyId = response.data.data.key_id;

  const options = {
    key: keyId,
    order_id: order.id,
    handler: async function (response) {
            await updateTransactionStatus(token, response, order.id, false);
            toastr.success("You are now a premium user");
    },
  };

  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on("payment.failed", async function (response) {
            await updateTransactionStatus(token, response, order.id, true);
            toastr.error("Something went wrong");
  });
}


async function getOrderId(token) {
    try{
        const response = await axios.get("http://localhost:5000/purchase/premiummembership",{ headers: { Authorization: token } });
        if(response.data.success){
            return response;
        }  
    } catch(err) {
        if (err.response && err.response.data && err.response.data.success === false) {
            // The error response contains a 'success' property set to 'false'.
            const errorMessage = err.response.data.message;
            toastr.error(errorMessage);
        } else {
            // Handle other errors (e.g., network errors) or provide a generic error message.
            toastr.error("An error occurred while fetching orderid.");
        }
    }
}

async function updateTransactionStatus(token, response, orderId, isPaymentFailed) {
    try {
        const res = await axios.post(
            "http://localhost:5000/purchase/updatetransactionstatus",
            {
            orderId: orderId,
            paymentId: response.razorpay_payment_id,
            isPaymentFailed: isPaymentFailed
            },
            { headers: { Authorization: token } }
        );
        if(res.data.success){
            toastr.success(res.data.message);
        }
    } catch (err) {
        if (err.response && err.response.data && err.response.data.success === false) {
            // The error response contains a 'success' property set to 'false'.
            const errorMessage = err.response.data.message;
            toastr.error(errorMessage);
        } else {
            // Handle other errors (e.g., network errors) or provide a generic error message.
            toastr.error("An error occurred while updating transaction.");
        }
        console.log(err);
       }
}
