import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PaymentPage.css';
import { FaHome, FaArrowLeft } from 'react-icons/fa';


function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const amount = parseFloat(queryParams.get('amount')) || 0;
  const formattedAmount = amount.toFixed(2);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderDate, setOrderDate] = useState('');
  const [showThankYouPage, setShowThankYouPage] = useState(false);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(items);
  }, []);

  const handlePayment = async () => {
    try {
      const orderDetails = {
        name,
        mobile,
        tableNumber,
        cartItems,  // Cart items saved with the order
        totalAmount: formattedAmount,
        date: orderDate,
      };

      // Send the order details to the server
      await fetch('http://localhost:5000/submitOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails),
      });

      // Clear the cart
      localStorage.removeItem('cartItems');

      // Show thank you page and redirect
      setShowThankYouPage(true);

      setTimeout(() => {
        navigate('/');
      }, 5000); // Redirect to home page after 6 seconds
    } catch (error) {
      console.error('Failed to process payment', error);
      alert('An error occurred while processing your payment. Please try again.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tableNumber.trim() === '') {
      alert('Please enter a table number.');
      return;
    }
    const currentDateTime = new Date().toLocaleString();
    setOrderDate(currentDateTime);
    setIsSubmitted(true);
  };

  return (
    <div className="container mt-5 payment-container">
      {showThankYouPage ? (
        <div className="thank-you-page text-center">
          <img
            src="https://i.gifer.com/7efs.gif"
            alt="Green Tick Icon"
            className="green-tick-icon"
          />
          <div className="thank-you-message mt-4">
            <h1>Thanks for your Order!</h1>
            <p>Your order will be at your table in just a few minutes. Enjoy your Food!</p>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between mb-4 custom-icons">
            <FaArrowLeft className="icon" onClick={() => navigate('/cart')} />
            <h2 className="payment-heading">Payment Page</h2>
            <FaHome className="icon" onClick={() => navigate('/')} />
          </div>

          {isSubmitted ? (
            <div>
   <div class="container"style={{ backgroundColor: 'white',height:'500px' }}>
   <div className="order-summary" >
     <h2>Order Summary</h2>
     <ul class="order-details">
       <li>
         <span><strong>Date and Time</strong></span>
         <span>:</span>
         <span>{orderDate}</span>
       </li><li>
   <span><strong>Name</strong></span>
   <span>:</span>
   <span>{name}</span>
 </li>
 <li>
   <span><strong>Mobile</strong></span>
   <span>:</span>
   <span>{mobile}</span>
 </li>
 <li>
   <span><strong>Table Number</strong></span>
   <span>:</span>
   <span>{tableNumber}</span>
 </li>
 <li>
   <span><strong>Total Price</strong></span>
   <span>:</span>
   <span>₹{formattedAmount}</span>
 </li>
</ul>
<h3 className='border-bottom p-2' style={{textAlign:'center',color:'#ffa500',fontFamily:'Times New Roman',fontWeight:'bold',fontSize:'35px'}}>Cart Items</h3>
<ul class="cart-details">
{cartItems.map(item => (
 <li key={item._id}>
   <span ><strong tyle={{width:'100px'}}> {item.name}</strong></span>
   <span>-</span>
   <span>₹{item.price} x {item.quantity || 1}</span>
 </li>
 ))}
</ul>
<button class="btn btn-primary mt-3">Place your Order</button>
</div>
</div>
</div>
 
          ) : (
            <form onSubmit={handleSubmit} className="text-center">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control text-center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">Mobile Number</label>
                <input
                  type="text"
                  id="mobile"
                  className="form-control text-center"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                />
              </div>
              <div className="mb-3 row justify-content-center">
                <label htmlFor="tableNumber" className="form-label col-12">Table Number</label>
                <div className="col-12 col-sm-8 col-md-6 col-lg-4">
                  <select
                    id="tableNumber"
                    className="form-control text-center"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    required
                  >
                    <option value="">Select a table</option>
                    {[...Array(10)].map((_, index) => (
                      <option key={index + 1} value={index + 1}>
                        {index + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <h4 className="text-center custom-total-price">Payable Amount: ₹{formattedAmount}</h4>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default PaymentPage;
