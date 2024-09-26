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
      await fetch('https://pizza-house-without-payment-api.vercel.app/submitOrder', {
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
              <div className="order-summary-container p-3" style={{ backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', maxWidth: '600px', margin: 'auto', textAlign: 'left', padding: '30px', backgroundSize: 'cover', backgroundPosition: 'center', marginLeft: '30px' }}>
                <div style={{ marginLeft: '5px', marginTop: '5px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', padding: '15px' }}>
                  <h4 className="mb-4 text-warning font-weight-bold border-bottom p-2" style={{ fontSize: '2rem', textAlign: 'center', fontFamily: 'League Spartan', fontWeight: 'bold' }}>
                    Order Summary 
                  </h4>

                  <div className="order-summary-details" style={{ color: 'black', fontSize: '16px' }}>
                    <div className="d-flex">
                      <p><strong>Date and Time</strong></p>
                      <div style={{ marginLeft: '150px' }}><p>&#58;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{orderDate}</p></div>
                    </div>
                    <div className="d-flex">
                      <p><strong>Name</strong></p>
                      <div style={{ marginLeft: '215px' }}><p>&#58;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{name}</p></div>
                    </div>
                    <div className="d-flex">
                      <p><strong>Mobile</strong></p>
                      <p style={{ marginLeft: '207px' }}>&#58;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{mobile}</p>
                    </div>
                    <div className="d-flex">
                      <p><strong>Table Number</strong></p>
                      <p style={{ marginLeft: '155px' }}>&#58;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tableNumber}</p>
                    </div>
                    <div className="d-flex">
                      <p><strong>Total Price</strong></p>
                      <p style={{ marginLeft: '183px' }}>&#58;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;₹{formattedAmount}</p>
                    </div>
                  </div>

                  <h4 className="mt-4 text-warning font-weight-bold border-bottom p-2" style={{ fontSize: '2.3rem', textAlign: 'center', fontFamily: 'League Spartan', fontWeight: 'bold' }}>
                    Cart Items
                  </h4>


                  <ol style={{ padding: '0', color: 'black' }}>
  {cartItems.map((item, index) => (
    <li key={item._id} className="d-flex justify-content-between py-2" style={{ fontSize: '16px' }}>
      <span><strong>{index + 1}. {item.name}</strong></span>
      <span className="rate" style={{ marginRight: '130px', display: 'flex' }}>- ₹{item.price} x {item.quantity || 1}</span>
    </li>
  ))}
</ol>


                  <div className="text-center">
                    <button className="btn btn-primary mt-4 mx-auto" style={{ width: '100%', maxWidth: '400px', fontSize: '1.2rem', backgroundColor: 'blue', border: 'none', color: 'white' }} onClick={handlePayment}>
                      Place your Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="text-center">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" id="name" className="form-control text-center" value={name} onChange={(e) => setName(e.target.value)} required />
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

              <div className="mb-3">
                <label htmlFor="tableNumber" className="form-label">Table Number</label>
                <select type="text" id="tableNumber" className="form-control text-center" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)}>
<option value={""}>Select a Table number</option>
<option value={'1'}>1</option>
<option value={"2"}>2</option>
<option value={"3"}>3</option>
<option value={"4"}>4</option>
<option value={"5"}>5</option>
<option value={"6"}>6</option>
<option value={"7"}>7</option>
<option value={"8"}>8</option>
<option value={"9"}>9</option>
<option value={"10"}>10</option>

                  </select>
              </div>
              <button type="submit" className="btn btn-primary mt-4">Submit</button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default PaymentPage;
