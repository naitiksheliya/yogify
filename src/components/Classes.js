import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; 
import '../index.css';
import { toast } from 'react-toastify';
import ClassItem from './classItem';

function Classes() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "classes"));
        const classesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log(classesList);
        setClasses(classesList);
      } catch (error) {
        toast.error('🦄 Could not fetch classes');
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <h2 className="text-3xl font-extrabold text-white mb-6">Upcoming Classes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <ClassItem key={classItem.id} classData={classItem} />
        ))}
      </div>
    </>
  );
}

export default Classes;