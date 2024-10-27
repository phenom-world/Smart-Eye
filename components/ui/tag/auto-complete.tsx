import React from 'react';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../command';
import { type Tag as TagType } from './tag-input';

type AutocompleteProps = {
  tags: TagType[];
  setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
  autocompleteOptions: TagType[];
  maxTags?: number;
  onTagAdd?: (tag: string) => void;
  allowDuplicates: boolean;
  children: React.ReactNode;
  disabled?: boolean;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  tags,
  setTags,
  autocompleteOptions,
  maxTags,
  onTagAdd,
  allowDuplicates,
  children,
  disabled,
}) => {
  return (
    <Command className="border">
      {children}
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {autocompleteOptions.map((option) => (
            <CommandItem key={option.id}>
              <div
                onClick={() => {
                  if (disabled) return;
                  if (maxTags && tags.length >= maxTags) return;
                  if (!allowDuplicates && tags.some((tag) => tag.text === option.text)) return;
                  setTags([...tags, option]);
                  onTagAdd?.(option.text);
                }}
              >
                {option.text}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
