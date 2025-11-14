import React from 'react';

const ToolsCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-5 border border-gray-100">
      <div className="flex-shrink-0">
        <img src="https://placehold.co/80x80/E0F2FE/0284C7?text=Doc" alt="Virtual Doctor" className="rounded-full" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-800">Tools</h2>
        <p className="text-gray-600 mt-1">Talk with your virtual doctor</p>
      </div>
    </div>
  );
};

export default ToolsCard;