import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, RotateCcw, Check, Lock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "@/components/ui/sonner";
import TagSelector from "./TagSelector";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

interface EditDialogProps {
  id?: string;
  title: string;
  description: string;
  author?: string;
  tags: string[];
  onClose: () => void;
  onSave: (title: string, description: string, tags: string[]) => void;
  isNew?: boolean;
}

const EditDialog = ({ 
  id,
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
  const { isAuthenticated } = useAuth();

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
    onSave(editedTitle, editedDescription, selectedTags);
    setHasUnsavedChanges(false);
    setIsEdited(false);
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
    <DialogContent className="max-w-4xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {displayTitle}{isEdited && " (*)"}
        </DialogTitle>
      </DialogHeader>
      <Tabs defaultValue={isNew || !isAuthenticated ? (isAuthenticated ? "edit" : "view") : "view"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <TabsTrigger 
            value="view"
            className="data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700"
          >
            {t.view}
          </TabsTrigger>
          <TabsTrigger 
            value="edit"
            disabled={!isAuthenticated}
            className={`data-[state=active]:bg-white data-[state=active]:text-primary dark:data-[state=active]:bg-gray-700 ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {!isAuthenticated ? (
              <div className="flex items-center gap-1">
                {t.edit} <Lock className="h-3 w-3 ml-1" />
              </div>
            ) : (
              t.edit
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="view" className="mt-4">
          <div className="space-y-4">
            {author && (
              <Badge variant="secondary" className="font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                {author}
              </Badge>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="outline" className="font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-300">{editedDescription}</p>
          </div>
        </TabsContent>
        <TabsContent value="edit" className="mt-4 space-y-4">
          <div className="space-y-4">
            {isNew && (
              <Input
                placeholder={t.promptTitle}
                value={editedTitle}
                onChange={(e) => handleContentChange(setEditedTitle, e.target.value)}
                className="w-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              />
            )}
            
            <Button 
              variant="outline" 
              onClick={() => setIsTagsVisible(!isTagsVisible)}
              className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {t.tags}
            </Button>
            
            {isTagsVisible && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <TagSelector
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedTags={selectedTags}
                  onTagToggle={handleTagToggle}
                />
              </div>
            )}

            <Textarea
              value={editedDescription}
              onChange={(e) => handleContentChange(setEditedDescription, e.target.value)}
              className="min-h-[200px] border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
              placeholder={t.promptDescription}
            />

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={handleRevert}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                {t.revert}
              </Button>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-md text-sm">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <p>{t.signInToEdit}</p>
          </div>
        </div>
      )}
    </DialogContent>
  );
};

export default EditDialog;
