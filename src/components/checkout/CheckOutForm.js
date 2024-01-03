import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import YourOrder from "./YourOrder";
import { SET_CART } from "../../redux/action";
import axios from 'axios';
import CustomerModel from "../../models/CustomerModel";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Vui lòng nhập tên người nhận!"),
  email: Yup.string().required("Vui lòng nhập email!"),
  phone: Yup.string().required("Vui lòng nhập số điện thoại người nhận!"),
  address: Yup.string().required("Vui lòng nhập địa chỉ!"),
});

function CheckOutForm(props) {
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const initialValues = {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCustomer((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    const customerCookie = CustomerModel.getCookie("customer");
    if (customerCookie) {
      const customerData = JSON.parse(customerCookie);
      setCustomer(customerData);
    }
  }, []);

  const handleSubmit = (values) => {
    values.cart = cart;
    console.log(values.cart)
    values.customer_id = customer ? customer.id : null;
    
    console.log(values.customer_id);
    axios.post('http://127.0.0.1:8000/api/order', values, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công!",
          showConfirmButton: false,
          timer: 1500,
        });
        // set local, setcart
        localStorage.removeItem("cart");
        dispatch({ type: SET_CART, payload: [] });
        // chuyển hướng
        navigate('/');
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Thanh toán thất bại!",
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className="container-fluid">
          <div className="row px-xl-5">
            <div className="col-lg-8">
              <h5 className="section-title position-relative text-uppercase mb-3">
                <span className="bg-secondary pr-3">Địa chỉ thanh toán</span>
              </h5>
              <div className="bg-light p-30 mb-5">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <label>Tên khách hàng</label>
                    <Field
                      className="form-control"
                      type="text"
                      placeholder="Name ..."
                      name="name"
                      value={customer.name}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>E-mail</label>
                    <Field
                      className="form-control"
                      type="text"
                      placeholder="zzz@gmail.com"
                      name="email"
                      value={customer.email}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Số điện thoại</label>
                    <Field
                      className="form-control"
                      type="text"
                      placeholder="+ 0123 456 789"
                      name="phone"
                      value={customer.phone}
                      onChange={handleChange}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="error"
                    />
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Địa chỉ</label>
                    <Field
                      className="form-control"
                      type="text"
                      placeholder="address ..."
                      name="address"
                      value={customer.address}
                      onChange={handleChange}
                    />
                    <ErrorMessage name="address" component="div" className="error" />
                  </div>
                </div>
                <div className="mb-5">
                  <div className="bg-light p-30">
                    <button type="submit" className="btn btn-block btn-primary font-weight-bold py-3">
                     Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <YourOrder />
          </div>
        </div>
      </Form>
    </Formik>
  );
}

export default CheckOutForm;