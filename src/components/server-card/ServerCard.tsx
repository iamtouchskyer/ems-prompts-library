import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "@/hooks/useLanguage";
import EditDialog from "./EditDialog";
import type { ServerCardProps } from "./types";
import { updatePrompt } from "@/services/promptService";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/context/AuthContext";
import { Check } from "lucide-react";
import { createPrompt, updatePrompt } from "@/services/promptService";

const ServerCard = ({ id, title, description, author, tags = [] }: ServerCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const { t } = useLanguage();

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  const handleSave = async (newTitle: string, newDescription: string, newTags: string[]) => {
    try {
      await updatePrompt(id, newTitle, newDescription, newTags);
      setHasUnsavedChanges(false);
      setIsDialogOpen(false);
      toast(t.changesSaved || "Changes saved successfully", {
        icon: <Check className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Error updating prompt:', error);
      toast(t.error || "Error updating prompt", {
        // Use proper toast syntax without variant
      });
    }
  };

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
            {tags.map((tag) => (
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
        <EditDialog
          id={id}
          title={title}
          description={description}
          author={author}
          tags={tags}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
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
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsDialogOpen(false);
                setShowUnsavedDialog(false);
              }}
            >
              {t.discard}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ServerCard;
