
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RotateCcw, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "../Navigation";
import { toast } from "@/components/ui/sonner";
import TagSelector from "./TagSelector";
import { Input } from "@/components/ui/input";

interface EditDialogProps {
  title: string;
  description: string;
  author?: string;
  tags: string[];
  onClose: () => void;
  onSave: () => void;
  isNew?: boolean;
}

const EditDialog = ({ 
  title: initialTitle, 
  description: initialDescription, 
  author, 
  tags: initialTags, 
  onClose, 
  onSave,
  isNew = false
}: EditDialogProps) => {
  const [isTagsVisible, setIsTagsVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const [editedDescription, setEditedDescription] = useState(initialDescription);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const { t } = useLanguage();

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setHasUnsavedChanges(true);
    setIsEdited(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    setIsEdited(false);
    onSave();
    toast(isNew ? t.promptCreated : t.changesSaved, {
      icon: <Check className="h-4 w-4" />,
    });
  };

  const handleRevert = () => {
    setSelectedTags(initialTags);
    setEditedDescription(initialDescription);
    setEditedTitle(initialTitle);
    setHasUnsavedChanges(false);
    setIsEdited(false);
  };

  const handleContentChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setHasUnsavedChanges(true);
    setIsEdited(true);
  };

  const displayTitle = isNew ? t.newPrompt : editedTitle;

  return (
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>{displayTitle}{isEdited && " (*)"}</DialogTitle>
      </DialogHeader>
      <Tabs defaultValue={isNew ? "edit" : "view"} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">{t.view}</TabsTrigger>
          <TabsTrigger value="edit">{t.edit}</TabsTrigger>
        </TabsList>
        <TabsContent value="view" className="mt-4">
          <div className="space-y-4">
            {author && (
              <Badge variant="secondary" className="font-medium">
                {author}
              </Badge>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-medium">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground">{editedDescription}</p>
          </div>
        </TabsContent>
        <TabsContent value="edit" className="mt-4 space-y-4">
          <div className="space-y-4">
            {isNew && (
              <Input
                placeholder={t.promptTitle}
                value={editedTitle}
                onChange={(e) => handleContentChange(setEditedTitle, e.target.value)}
                className="w-full"
              />
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setIsTagsVisible(!isTagsVisible)}
              className="w-full"
            >
              {t.tags}
            </Button>
            
            {isTagsVisible && (
              <TagSelector
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            )}

            <Textarea
              value={editedDescription}
              onChange={(e) => handleContentChange(setEditedDescription, e.target.value)}
              className="min-h-[200px]"
              placeholder={t.promptDescription}
            />

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleRevert}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                {t.revert}
              </Button>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default EditDialog;
