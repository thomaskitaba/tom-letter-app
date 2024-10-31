import React from 'react';

const TestTailwind = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h1>
            <p className="text-lg text-gray-700 mb-6">If you see the styled elements below, Tailwind CSS is working!</p>
            <div className="bg-green-400 text-white p-4 rounded-lg shadow-lg">
                <p className="text-lg">This is a Tailwind CSS component!</p>
            </div>
            <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
                Click Me
            </button>
        </div>
    );
};

export default TestTailwind;

