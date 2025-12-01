'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  maxTags?: number;
}

export function TagInput({ placeholder = 'Add a tag...', tags, onTagsChange, maxTags = 10 }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < maxTags) {
      onTagsChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-2 bg-slate-950 border border-slate-800 rounded-lg focus-within:border-indigo-500 transition-colors min-h-[42px]">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20"
          >
            {tag}
            <button
              onClick={() => removeTag(index)}
              className="hover:text-indigo-300 focus:outline-none"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder:text-slate-500 min-w-[120px]"
          placeholder={tags.length < maxTags ? placeholder : ''}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          disabled={tags.length >= maxTags}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">
        {tags.length}/{maxTags} tags
      </p>
    </div>
  );
}
