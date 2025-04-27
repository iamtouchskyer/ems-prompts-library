
import { Card, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useLanguage } from "../Navigation";

interface CreateNewCardProps {
  onOpen: () => void;
}

const CreateNewCard = ({ onOpen }: CreateNewCardProps) => {
  const { t } = useLanguage();

  return (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer flex flex-col items-center justify-center h-full py-8" 
      onClick={onOpen}
    >
      <div className="flex flex-col items-center gap-4">
        <CardTitle className="text-2xl text-gray-400">{t.createNew}</CardTitle>
        <Plus className="w-12 h-12 text-gray-400" />
      </div>
    </Card>
  );
};

export default CreateNewCard;
