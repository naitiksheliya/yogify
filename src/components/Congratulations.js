import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

function Congratulations() {
  const location = useLocation();
  const { userName, instructorName, classAddress, classId,bookingId } = location.state;
  const auth = getAuth();

  useEffect(() => {
    const addClassToUser = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            bookingIds: arrayUnion(bookingId),
        });
      }
    };

    addClassToUser();
  }, [auth.currentUser, classId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-semibold mb-6 text-white">Congratulations, {userName}!</h2>
        <p className="text-lg text-white mb-4">
          Thank you for booking the class. Your instructor, {instructorName}, is excited to have you!
        </p>
        <p className="text-lg text-white mb-4">
          The class will be held at:
        </p>
        <p className="text-xl font-bold text-yellow-300 bg-gray-900 p-4 rounded-lg mb-4">
          {classAddress}
        </p>
        <p className="text-lg text-white">
          We look forward to seeing you in the class.
        </p>
      </div>
    </div>
  );
}

export default Congratulations;