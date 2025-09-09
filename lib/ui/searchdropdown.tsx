import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './dropdown';
import { Input } from './input';

export type OptionType = {
  id: string;
  name: string;
};

type SearchableListProps = {
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
};

const SearchableList: React.FC<SearchableListProps> = React.memo(
  ({
    options,
    onSelect,
    children,
    className,
    searchPlaceholder = 'Search destinations',
  }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce implementation
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }, [searchTerm]);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
      if (!debouncedSearchTerm) return options;
      return options.filter((option) =>
        option.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      );
    }, [options, debouncedSearchTerm]);

    // Focus input when component mounts
    useEffect(() => {
      inputRef.current?.focus();
    }, []);

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none">
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={`max-h-60 w-64 max-w-80 overflow-y-auto lg:w-80 ${className}`}
        >
          <div className="max-h-96 w-full">
            {/* Search input */}
            <DropdownMenuLabel>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 size-3 -translate-y-1/2 text-gray-400 md:left-4 md:size-4" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8 p-2 pl-6 text-xs md:pl-10 md:text-sm"
                />
              </div>
            </DropdownMenuLabel>

            {/* Results list */}
            <div className="overflow-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => {
                      onSelect(option);
                      setSearchTerm('');
                    }}
                    className="cursor-pointer px-4 py-3 text-xs font-medium hover:bg-orange-100 sm:text-sm"
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem className="py-3 text-center text-gray-500">
                  {searchTerm ? 'No matches found' : 'No options available'}
                </DropdownMenuItem>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

SearchableList.displayName = 'SearchableList';
export default SearchableList;
