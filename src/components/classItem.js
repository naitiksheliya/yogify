import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaClock, FaLaptop, FaChalkboardTeacher, FaEdit, FaMapPin } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, updateDoc, arrayUnion, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


function ClassItem({ classData }) {
  const auth = getAuth();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  const [booknowbutton, setBooknowbutton] = useState(true);
  useEffect(() => {
    checkIfUserEnrolled();
  }, []);

  const checkIfUserEnrolled = () => {
    if (auth.currentUser && classData.students) {
      if (classData.students.includes(auth.currentUser.uid)) {
        setBooknowbutton(false);
      }
    }
  };

  const handleAction = async () => {
    if (auth.currentUser && auth.currentUser.uid === classData.instructorId) {
      // Navigate to edit class page
      navigate(`/edit-class/${classData.id}`);
    } else {
      // Fetch instructor's name
      const instructorRef = doc(db, 'users', classData.instructorId);
      const instructorSnap = await getDoc(instructorRef);
      const instructorName = instructorSnap.data().name;

      // Handle booking logic here
      const bookingDetails = {
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        email:auth.currentUser.email,
        instructorName: instructorName,
        classId: classData.id,
        address:classData.address,
        title:classData.title,
        imageUrl:classData.imageUrl,
        level:classData.level,
        modeofclasses:classData.modeOfClasses,
        timestamp: serverTimestamp(),
      };

      // Add booking details to the 'bookings' collection
      console.log(bookingDetails);
      const docRef = await addDoc(collection(db, 'bookings'), bookingDetails);

      // Append the user ID to the 'students' array in the class document
      const classRef = doc(db, 'classes', classData.id);
      await updateDoc(classRef, {
        students: arrayUnion(auth.currentUser.uid),
      });

      // Navigate to the Congratulations page
      navigate('/congratulations', {
        state: {
        username: auth.currentUser.displayName,
        email:auth.currentUser.email,
        instructorName: instructorName,
        classId: classData.id,
        address:classData.address,
        title:classData.title,
        imageUrl:classData.imageUrl,
        level:classData.level,
        modeofclasses:classData.modeOfClasses,
        timestamp: serverTimestamp(),
        },
      });
    }
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex flex-col h-full">
      <img className="rounded-t-lg w-full h-48 object-cover" src={classData.imageUrl} alt={classData.title} />
      <div className="p-5 flex flex-col flex-grow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{classData.title}</h5>
        <div className="mb-3 overflow-y-auto h-24 custom-scrollbar">
          <p className="font-normal text-gray-700 dark:text-gray-400">{classData.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-xs px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
            <FaMapMarkerAlt className="w-3 h-3 me-1" />
            {classData.city}
          </button>
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-xs px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
            <FaUsers className="w-3 h-3 me-1" />
            {classData.capacity} students
          </button>
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-xs px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
            <FaCalendarAlt className="w-3 h-3 me-1" />
            {formatDate(classData.date)}
          </button>
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-xs px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
            <FaClock className="w-3 h-3 me-1" />
            {formatTime(classData.date)}
          </button>
          <button className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-xs px-2.5 py-1.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
            {classData.modeOfClasses === 'Online' ? (
              <FaLaptop className="w-3 h-3 me-1" />
            ) : (
              <FaChalkboardTeacher className="w-3 h-3 me-1" />
            )}
            {classData.modeOfClasses}
          </button>
        </div>
        <button
          disabled={!booknowbutton}
          onClick={handleAction}
          className={`inline-flex text-center items-center px-3 py-2 text-sm font-medium text-center rounded-lg focus:outline-none ${
            booknowbutton
              ? 'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
              : 'text-gray-500 bg-gray-300 cursor-not-allowed'
          }`}
        >
          {!(auth.currentUser && auth.currentUser.uid === classData.instructorId) ? (
            <>
              {booknowbutton ? 'Book now' : 'Booked'}
              {booknowbutton && (
                <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                </svg>
              )}
            </>
          ) : (
            <>
              Edit Class
              <FaEdit className="w-3.5 h-3.5 ms-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ClassItem;
