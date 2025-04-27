
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useLanguage } from "../Navigation";
import { allTags } from "./types";

interface TagSelectorProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

const TagSelector = ({ searchQuery, onSearchChange, selectedTags, onTagToggle }: TagSelectorProps) => {
  const { t } = useLanguage();
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput 
        placeholder={t.searchTags}
        value={searchQuery}
        onValueChange={onSearchChange}
      />
      <CommandList>
        <CommandEmpty>No tags found.</CommandEmpty>
        <CommandGroup>
          {filteredTags.map((tag) => (
            <CommandItem
              key={tag}
              onSelect={() => onTagToggle(tag)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => onTagToggle(tag)}
                />
                {tag}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default TagSelector;
