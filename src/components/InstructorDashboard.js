import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import ClassItem from './classItem'
import { toast } from 'react-toastify'

function InstructorDashboard() {
  const [classes, setClasses] = useState([])
  const auth = getAuth()

  useEffect(() => {
    const fetchCreatedClasses = async () => {
      try {
        const classesRef = collection(db, "classes");
        const q = query(classesRef, where("instructorId", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);

        const fetchedClasses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setClasses(fetchedClasses);
      } catch (error) {
        console.error("Error fetching created classes:", error);
        toast.error("Failed to fetch created classes");
      }
    };
    fetchCreatedClasses()
  }, [auth.currentUser.uid])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6 text-center text-white">Instructor Dashboard</h1>
      
      <div className="mb-8 flex justify-center">
        <Link
          to="/create-listing"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition duration-200"
        >
          Create New Class
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-white">Your Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <ClassItem key={classItem.id} classData={classItem} />
        ))}
      </div>
    </div>
  )
}

export default InstructorDashboard