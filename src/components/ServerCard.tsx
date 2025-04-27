
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
import { useState } from "react";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [selectedTags, setSelectedTags] = useState<string[]>(tags);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  if (isNew) {
    return (
      <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => setIsDialogOpen(true)}>
        <CardHeader className="flex items-center justify-center h-40">
          <CardTitle className="text-2xl text-gray-400">Create New Prompt</CardTitle>
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
            View Details
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="view" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="view">View</TabsTrigger>
              <TabsTrigger value="edit">Edit</TabsTrigger>
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
                <p className="text-muted-foreground">{description}</p>
              </div>
            </TabsContent>
            <TabsContent value="edit" className="mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput 
                      placeholder="Search tags..."
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
                </div>
                {/* Add other edit fields here */}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServerCard;
