import React, { useState, useEffect, useRef } from 'react';

const AutocompleteInput = ({ 
  value, 
  onChange, 
  placeholder, 
  suggestions = [], 
  className = "",
  name = ""
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (value && suggestions.length > 0) {
      const inputLower = value.toLowerCase();
      
      const filtered = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(inputLower)
        )
        .sort((a, b) => {
          const aLower = a.toLowerCase();
          const bLower = b.toLowerCase();
          
          // Exact match first
          if (aLower === inputLower) return -1;
          if (bLower === inputLower) return 1;
          
          // Then suggestions that start with the input
          const aStartsWith = aLower.startsWith(inputLower);
          const bStartsWith = bLower.startsWith(inputLower);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          // If both start with input or both don't, sort alphabetically
          return a.localeCompare(b);
        });
      
      setFilteredSuggestions(filtered);
      
      // Don't show suggestions if the current value exactly matches a suggestion
      const exactMatch = suggestions.some(suggestion => 
        suggestion.toLowerCase() === inputLower
      );
      
      setShowSuggestions(filtered.length > 0 && !exactMatch);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value, suggestions]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(e);
    
    // Check if the new value exactly matches a suggestion
    const exactMatch = suggestions.some(suggestion => 
      suggestion.toLowerCase() === newValue.toLowerCase()
    );
    
    setShowSuggestions(newValue.length > 0 && !exactMatch);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    onChange({
      target: {
        name: name,
        value: suggestion
      }
    });
    setShowSuggestions(false);
    setSelectedIndex(-1);
    // Blur the input to ensure dropdown closes
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={suggestionsRef}>
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (value.length > 0 && filteredSuggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={`w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        autoComplete="off"
      />
      
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors ${
                index === selectedIndex ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
              }`}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
