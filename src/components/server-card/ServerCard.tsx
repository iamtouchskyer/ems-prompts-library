
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLanguage } from "../Navigation";
import CreateNewCard from "./CreateNewCard";
import EditDialog from "./EditDialog";
import type { ServerCardProps } from "./types";

const ServerCard = ({ title, description, author, tags = [], isNew = false }: ServerCardProps) => {
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

  if (isNew) {
    return <CreateNewCard onOpen={() => setIsDialogOpen(true)} />;
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
          title={title}
          description={description}
          author={author}
          tags={tags}
          onClose={() => setIsDialogOpen(false)}
          onSave={() => {
            setHasUnsavedChanges(false);
            setIsDialogOpen(false);
          }}
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
            <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
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
