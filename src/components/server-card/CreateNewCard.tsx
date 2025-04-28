
import { Card, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import EditDialog from "./EditDialog";
import { toast } from "sonner";
import { Check, Lock } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/context/AuthContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createPrompt } from "@/services/promptService";

const CreateNewCard = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
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

  const handleSaveSuccess = async (title: string, description: string, tags: string[]) => {
    try {
      await createPrompt({ title, content: description, tags, is_public: true });
      setHasUnsavedChanges(false);
      setIsDialogOpen(false);
      toast.success(t.promptCreated);
    } catch (error) {
      console.error('Error creating prompt:', error);
      toast.error(t.failedToCreatePrompt);
    }
  };

  const handleCardClick = () => {
    if (isAuthenticated) {
      setIsDialogOpen(true);
    } else {
      toast(t.signInRequired, {
        description: t.signInRequiredDesc,
      });
    }
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card 
              className={`hover:shadow-lg transition-all ${isAuthenticated ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'} flex flex-col items-center justify-center h-full py-8`} 
              onClick={handleCardClick}
            >
              <div className="flex flex-col items-center gap-4">
                <CardTitle className="text-2xl text-gray-400">{t.createNew}</CardTitle>
                {isAuthenticated ? (
                  <Plus className="w-12 h-12 text-gray-400" />
                ) : (
                  <Lock className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </Card>
          </TooltipTrigger>
          {!isAuthenticated && (
            <TooltipContent>
              <p>{t.signInToEdit}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

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
