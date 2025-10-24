'use client';

import { useState } from 'react';

export function EditorPanel() {
  const [content, setContent] = useState(`// Welcome to the editor
function hello() {
  console.log("Hello, World!");
}

// Start typing...
`);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-r border-gray-700">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-sm text-gray-400 ml-2">untitled.js</span>
        </div>
        <div className="text-xs text-gray-500">JavaScript</div>
      </div>

      {/* Line Numbers and Editor */}
      <div className="flex-1 flex overflow-auto font-mono text-sm">
        {/* Line Numbers */}
        <div className="bg-[#1e1e1e] px-4 py-4 text-gray-600 select-none border-r border-gray-800">
          {content.split('\n').map((_, i) => (
            <div key={i} className="leading-6 text-right">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-[#1e1e1e] text-gray-200 px-4 py-4 outline-none resize-none leading-6 font-mono"
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="px-4 py-1 bg-[#007acc] text-white text-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Ln {content.substring(0, content.length).split('\n').length}, Col 1</span>
          <span>UTF-8</span>
        </div>
        <div>Ready</div>
      </div>
    </div>
  );
}

