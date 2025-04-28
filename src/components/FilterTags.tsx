import { useLanguage } from "@/hooks/useLanguage";

interface FilterTagsProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const FilterTags = ({ tags, selectedTag, onSelectTag }: FilterTagsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-wrap gap-2 my-6">
      <button
        key="all"
        onClick={() => onSelectTag("All")}
        className={`px-4 py-2 rounded-full text-sm font-medium ${
          selectedTag === "All"
            ? "bg-blue-900 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {t.all}
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            selectedTag === tag
              ? "bg-blue-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default FilterTags;
