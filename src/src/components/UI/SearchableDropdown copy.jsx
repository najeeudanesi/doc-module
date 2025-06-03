import { Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SearchableDropdown = ({ options, label, placeholder, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    setSearchTerm(option.name);
    setIsOpen(false);
    onChange({ target: { value: option.name } });
  };

  useEffect(() => {
    if (searchTerm === '' && selectedOption) {
      setSelectedOption(null);
      onChange({ target: { value: '' } });
    }
  }, [searchTerm, selectedOption, onChange]);

  return (
    <div className="relative">
      <div className="flex flex-v-center m-t-10">
        <div className="label p-9">{label}</div>
        <div className="flex flex-v-center search-input2 relative">  
          <input
            id="searchDropdown"
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <Search className="h-3 w-3 text-gray-400 absolute right-2" />
        </div>
      </div>
      {isOpen && searchTerm.length>2 && (
        <div className="dropdown-div">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className="drop-item"
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </div>
          ))}
          {filteredOptions.length === 0 && (
            <div className="px-4 py-2 text-gray-500">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
