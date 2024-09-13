import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './MyOrders.css'; // Import custom CSS for additional styling

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reverseOrder, setReverseOrder] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('https://pizza-house-without-payment-api.vercel.app/getOrders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();

        // Sort orders with "Delivered" at the bottom
        data.sort((a, b) => (a.status === 'Delivered' ? 1 : -1));

        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId) => {
    try {
      const response = await fetch(`https://pizza-house-without-payment-api.vercel.app/updateOrderStatus/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Delivered' }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update orders in the state after successful status change
      const updatedOrders = orders.map((order) => {
        if (order._id === orderId) {
          return { ...order, status: 'Delivered' };
        }
        return order;
      });

      // Sort orders with "Delivered" at the bottom
      updatedOrders.sort((a, b) => (a.status === 'Delivered' ? 1 : -1));

      setOrders(updatedOrders);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleReverseOrder = () => {
    setReverseOrder(!reverseOrder);
  };

  const displayedOrders = reverseOrder ? [...orders].reverse() : orders;

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">Error: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/admin" className="btn btn-secondary custom-back-btn">
          <i className="fa fa-arrow-left"></i>
        </Link>
        <h4 className="custom-title text-center">My Orders</h4>
        <button
          className="btn btn-info" style={{width:'40px'}}
          onClick={toggleReverseOrder}
          aria-label={reverseOrder ? 'Normal Order' : 'Reverse Order'}
        >
          <i className={`fa ${reverseOrder ? 'fa-arrow-down' : 'fa-arrow-up'}`} />
        </button>
      </div>

      {displayedOrders.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover shadow-sm" style={{textAlign:"center", verticalAlign: "middle"}}> 
            <thead className="thead-dark">
              <tr>
                <th>S.No</th>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Table Number</th>
                <th style={{width:"800px"}}>Cart Items</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{reverseOrder ? displayedOrders.length - index : index + 1}</td>
                  <td>{order._id}</td>
                  <td>{new Date(order.date).toLocaleString()}</td>
                  <td>{order.name}</td>
                  <td>{order.mobile}</td>
                  <td>{order.tableNumber}</td>
                  <td>
                    <ul className="list" style={{fontWeight:'normal',fontSize:'14px',textAlign:'left'}}>
                      {order.cartItems.map((item) => (
                        <li key={item._id}>
                          {item.name} - ₹{item.price} x {item.quantity || 1}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td>
                    {order.status === 'Delivered' ? (
                      <span className="badge bg-success">Delivered</span>
                    ) : (
                      <button
                        className="btn btn-warning"
                        onClick={() => handleStatusChange(order._id)}
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No orders found.</p>
      )}
    </div>
  );
}

export default MyOrders;
