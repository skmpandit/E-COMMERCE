// import MailOutline from '@material-ui/icons/MailOutline';
// import React, { Fragment } from 'react'
// import "./ForgotPassword.css"
// import { useEffect } from 'react';
// import { useState } from 'react';
// import { useAlert } from 'react-alert';
// import { useDispatch, useSelector } from 'react-redux'
// import { clearErrors, forgotPassword } from '../../actions/userAction';
// import Loader from '../layout/Loader/Loader';
// import MetaData from '../layout/MetaData';

// const ForgotPassword = () => {
//     const dispatch = useDispatch();
//     const alert = useAlert();

//     const { error, message, loading } = useSelector((state) => state.forgotPassword);

//     const [email, setEmail] = useState("");

//     const forgotPasswordSubmit = (e) => {
//         e.preventDefault();

//         const myForm = new FormData();
//         myForm.set("email", email);
//         dispatch(forgotPassword(myForm));
//     }

//     useEffect(() => {
//         if(error) {
//             alert.error(error);
//             dispatch(clearErrors());
//         }
//         if(message) {
//             alert.success(message);
//         }
//     }, [dispatch, error, alert, message]);
//   return (
//     <Fragment>
//         {loading ? ( <Loader/> ) : (
//             <Fragment>
//                 <MetaData title="Forgot Password" />
//                 <div className="forgotPasswordContainer">
//                     <div className="forgotPasswordBox">
//                         <h2 className="forgotPasswordHeading">Forgot Password</h2>
//                         <form onSubmit={forgotPasswordSubmit} className="forgotPasswordForm">
//                             <div className="forgotPasswordEmail">
//                                 <MailOutline/>
//                                 <input type="email" placeholder='Email' required name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                             </div>
//                             <input type="submit" value="Send" className="forgotPasswordBtn" />
//                         </form>
//                     </div>
//                 </div>
//             </Fragment>
//         )}
//     </Fragment>
//   )
// }

// export default ForgotPassword