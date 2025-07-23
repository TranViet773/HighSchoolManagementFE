import React from 'react';

const FolderCard = ({ 
  year = "2023-2024", 
  className = "Lớp 12A1", 
  quantity = "0",
  classId,
  teacherId
}) => {
  return (
    <a href={`/teacher/advisor/${teacherId}?year=${year}`}>
        <div className="w-64 h-48 cursor-pointer transition-transform duration-300 hover:scale-104">
      <div className="relative w-full h-full">
        {/* Folder tab - phần nhỏ phía trên */}
        <div className="absolute top-0 left-0 w-20 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-t-lg border-2 border-orange-400"></div>
        
        {/* Main folder body */}
        <div className="absolute top-6 left-0 w-full h-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-lg shadow-lg border-2 border-yellow-400">
          {/* Folder content area */}
          <div className="p-6 h-full flex flex-col justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 space-y-3">
              <div className="text-center">
                <h3 className="text-white font-bold text-lg mb-3 drop-shadow-md">
                  Thông tin lớp học
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Năm học:</span>
                  <span className="text-white font-semibold bg-white/20 px-2 py-1 rounded text-sm">
                    {year}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Tên lớp:</span>
                  <span className="text-white font-semibold bg-white/20 px-2 py-1 rounded text-sm">
                    {className}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/90 font-medium">Môn học:</span>
                  <span className="text-white font-semibold bg-white/20 px-2 py-1 rounded text-sm">
                    {quantity} học sinh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Folder highlight effect */}
        <div className="absolute top-8 left-2 w-16 h-3 bg-white/30 rounded-full blur-sm"></div>
      </div>
    </div>
    </a>
  );
};
export default FolderCard;
// Demo component
