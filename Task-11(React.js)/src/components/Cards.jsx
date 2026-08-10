import React from 'react'

const Cards = ({id, title, description, onDelete }) => {
  return (
    <div>
      <div className="w-80 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-3 text-2xl font-bold capitalize text-gray-800">
          {title}
        </h2>

        <p className="mb-6 text-gray-600">{description}</p>

        <button
          className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Cards
