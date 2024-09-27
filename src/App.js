import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar'; // Import the Navbar component
import ExplorePage from './components/ExplorePage'; // Import the ExplorePage component
import './index.css'; // Import the merged CSS file
import { ToastContainer } from 'react-toastify'
import Classes from './components/Classes';
import SignIn from './components/Signin';
import SignUp from './components/Signup';
import Profile from './components/Profile';
import Spinner from './components/spinner';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from './components/CreateListing';
import EditClass from './components/EditClass';
import InstructorDashboard from './components/InstructorDashboard';
import Congratulations from './components/Congratulations';
import UserDashboard from './components/userDashboard'; // Import UserDashboard

function App() {
  return (
    <>
    <ToastContainer />
      <Router>
      <Navbar />
      <div className="App min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
          <Routes>
          <Route path='/profile' element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />} />
          </Route>
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
            <Route path="/" element={<ExplorePage />} />
            <Route path="/upcoming-classes" element={<Classes />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/edit-class/:classId" element={<EditClass />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
            <Route path="/congratulations" element={<Congratulations />} />
            {/* <Route path="/user-dashboard" element={<UserDashboard />} /> */}
          </Routes>
        </div>
        </div>
      </Router>
    </>

  );
}

export default App;
