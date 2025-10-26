'use client';

import { Sparkles, Image, Video } from 'lucide-react';

export function GeneratePanel() {
  return (
    <div className="flex flex-col bg-white text-gray-900 rounded-2xl h-full shadow-sm border border-gray-100">

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Sparkles size={32} className="text-[#6E56CF]" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-900">
              Say what you want to create!
            </h3>
            <p className="text-sm text-gray-600">
              Image or video, etc.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Image size={20} />
              <span className="text-xs">Images</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Video size={20} />
              <span className="text-xs">Videos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

