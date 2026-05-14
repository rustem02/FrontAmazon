import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from "./utils/PrivateRoute";
import AdminRoute from "./utils/AdminRoute";

import MainPage from "./containers/MainPage";
import Login from "./containers/Login";
import Register from "./containers/Register";
import ResetPassword from "./containers/ResetPassword";
import DocumentSubmission from "./containers/DocumentSubmission";
import VerifyDocs from "./containers/VerifyDocs"; 
import UserDocuments from "./containers/UserDocuments";

import { AuthProvider } from "./context/AuthContext";
import Booking from "./containers/Booking"; 
import ConfirmationPage from "./containers/ConfirmationPage";
import PaymentBooking from "./containers/PaymentBooking";
import Oops from "./containers/ResponsePages/Oops";
import MyBookings from "./containers/MyBookings";
import DocSumbitted from "./containers/ResponsePages/DocSumbitted";
import UpdateSubmission from "./containers/UpdateSubmission";
import CongratsBooking from "./containers/ResponsePages/CongratsBooking";
import ProfilePage from "./containers/ProfilePage";
import Rooms from "./containers/Rooms";
import News from "./containers/News";
import NewsPublish from "./containers/AdminPages/NewsPublish";
import AddNews from "./containers/AdminPages/AddNews";
import AdminDashboard from "./containers/AdminPages/AdminDashboard";
import CongratsPublished from "./containers/ResponsePages/CongratsPublished";
import AboutUs from "./containers/AboutUs";
import SupportChat from "./containers/SupportChat";
import Notifications from "./containers/Notifications";
import PaymentSuccess from "./containers/ResponsePages/PaymentSuccess";
import PaymentFail from "./containers/ResponsePages/PaymentFail";
import PaymentSimulator from "./containers/PaymentSimulator";

const App = () => {
  return (
      <Router>
        <AuthProvider>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/document-submission" element={<PrivateRoute><DocumentSubmission/></PrivateRoute>}/>
                <Route exact path="/verify-documents" element={<PrivateRoute><AdminRoute><VerifyDocs/></AdminRoute></PrivateRoute>}/>
                <Route exact path="/detailed-doc/:email" element={<PrivateRoute><AdminRoute><UserDocuments/></AdminRoute></PrivateRoute>}/>
                <Route exact path="/booking" element={<PrivateRoute><Booking/></PrivateRoute>}/>
                <Route exact path="/confirmation-booking" element={<PrivateRoute><ConfirmationPage/></PrivateRoute>}/>
                <Route exact path="/payment-booking" element={<PrivateRoute><PaymentBooking/></PrivateRoute>}/>
                <Route exact path="/oops" element={<Oops/>}/>
                <Route exact path="/my-booking" element={<PrivateRoute><MyBookings/></PrivateRoute>}/>
                <Route exact path="/doc-submitted" element={<DocSumbitted/>}/>
                <Route exact path="/update-submission" element={<PrivateRoute><UpdateSubmission/></PrivateRoute>}/>
                <Route exact path="/congrats-booking" element={<CongratsBooking/>}/>
                <Route exact path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
                <Route exact path="/rooms" element={<Rooms/>}/>
                <Route exact path="/news" element={<News/>}/>
                <Route exact path="/news-admin" element={<PrivateRoute><AdminRoute><NewsPublish/></AdminRoute></PrivateRoute>}/>
                <Route exact path="/add-news" element={<PrivateRoute><AdminRoute><AddNews/></AdminRoute></PrivateRoute>}/>
                <Route exact path="/admin-dashboard" element={<PrivateRoute><AdminRoute><AdminDashboard/></AdminRoute></PrivateRoute>}/>
                <Route exact path="/congrats-published" element={<CongratsPublished/>}/>
                <Route exact path="/about-us" element={<AboutUs/>}/>
                <Route exact path="/support-chat" element={<PrivateRoute><SupportChat/></PrivateRoute>}/>
                <Route exact path="/notifications" element={<PrivateRoute><Notifications/></PrivateRoute>}/>
                <Route exact path="/payment-success" element={<PrivateRoute><PaymentSuccess/></PrivateRoute>}/>
                <Route exact path="/payment-fail" element={<PrivateRoute><PaymentFail/></PrivateRoute>}/>
                <Route exact path="/payment-simulator" element={<PrivateRoute><PaymentSimulator/></PrivateRoute>}/>
                <Route
                  path="/main-page"
                  element={
                    <PrivateRoute>
                      <MainPage />
                    </PrivateRoute>
                  }
                />
                <Route exact path="/reset-password" element={<ResetPassword/>}/>
                <Route exact path="/password-reset/:token" element={<ResetPassword/>}/>
            </Routes>
          </AuthProvider>
      </Router>
  );
};
export default App;