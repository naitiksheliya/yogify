import React from 'react';

function ClassItem({ classData }) {
  return (
    <div className="relative flex flex-col md:flex-row w-full my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-96">
      <div className="relative p-2.5 md:w-2/5 shrink-0 overflow-hidden aspect-square">
        <img
          src={classData.imageUrl}
          alt={classData.title || "class image"}
          className="w-full h-full rounded-md md:rounded-lg object-cover object-center"
        />
      </div>
      <div className="p-6">
        <div className="mb-4 rounded-full bg-teal-600 py-0.5 px-2.5 border border-transparent text-xs text-white transition-all shadow-sm w-20 text-center">
          {classData.modeOfClasses}
        </div>
        <h4 className="mb-2 text-slate-800 text-xl font-semibold">
          {classData.title}
        </h4>
        <p className="mb-2 text-slate-600 leading-normal font-light">
          {classData.description}
        </p>
        <div className="mb-4 text-sm text-slate-500">
          {/* <p>Date: {classData.date}</p> */}
          <p>City: {classData.city}</p>
          <p>Capacity: {classData.capacity} students</p>
        </div>
        <div>
          <a href="#" className="text-slate-800 font-semibold text-sm hover:underline flex items-center">
            book now
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default ClassItem;
