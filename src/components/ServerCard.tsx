
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Save, RotateCcw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Language, useLanguage } from "./Navigation";

interface ServerCardProps {
  title: string;
  description: string;
  author?: string;
  tags?: string[];
  isNew?: boolean;
}

const allTags = [
  "Edge",
  "Copilot", 
  "SuperApp",
  "Engineer",
  "PM",
  "Designer",
  "Testing"
];

const ServerCard = ({ title, description, author, tags = [], isNew = false }: ServerCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTagsVisible, setIsTagsVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedDescription, setEditedDescription] = useState(description);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { t } = useLanguage();

  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setHasUnsavedChanges(true);
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    // Here you would typically save the changes to your backend
  };

  const handleRevert = () => {
    setSelectedTags(tags);
    setEditedDescription(description);
    setHasUnsavedChanges(false);
  };

  if (isNew) {
    return (
      <Card 
        className="hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center h-full" 
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-400">{t.createNew}</CardTitle>
          <Plus className="w-12 h-12 text-gray-400 mt-4" />
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="hover:shadow-lg transition-all">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            {author && (
              <Badge variant="secondary" className="font-medium">
                {author}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="outline" className="font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
            {t.view}
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="view" className="w-full">
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
                <Button 
                  variant="outline" 
                  onClick={() => setIsTagsVisible(!isTagsVisible)}
                  className="w-full"
                >
                  {t.tags}
                </Button>
                
                {isTagsVisible && (
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput 
                      placeholder={t.searchTags}
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                    />
                    <CommandList>
                      <CommandEmpty>No tags found.</CommandEmpty>
                      <CommandGroup>
                        {filteredTags.map((tag) => (
                          <CommandItem
                            key={tag}
                            onSelect={() => handleTagToggle(tag)}
                          >
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedTags.includes(tag)}
                                onChange={() => handleTagToggle(tag)}
                              />
                              {tag}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                )}

                <Textarea
                  value={editedDescription}
                  onChange={(e) => {
                    setEditedDescription(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="min-h-[200px]"
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
      </Dialog>

      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.unsavedChanges}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.unsavedChanges}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleSave();
                setIsDialogOpen(false);
                setShowUnsavedDialog(false);
              }}
            >
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServerCard;
