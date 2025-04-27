
import { Card, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useLanguage } from "../Navigation";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import EditDialog from "./EditDialog";
import { toast } from "@/components/ui/sonner";
import { Check } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const CreateNewCard = () => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsDialogOpen(false);
    }
  };

  const handleSaveSuccess = () => {
    setHasUnsavedChanges(false);
    setIsDialogOpen(false);
    toast("New prompt created successfully", {
      icon: <Check className="h-4 w-4" />,
    });
  };

  return (
    <>
      <Card 
        className="hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center h-full py-8" 
        onClick={() => setIsDialogOpen(true)}
      >
        <div className="flex flex-col items-center gap-4">
          <CardTitle className="text-2xl text-gray-400">{t.createNew}</CardTitle>
          <Plus className="w-12 h-12 text-gray-400" />
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <EditDialog
          title={t.newPrompt}
          description=""
          tags={[]}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveSuccess}
          isNew
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

export default CreateNewCard;
