
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

interface ServerCardProps {
  title: string;
  description: string;
  isOfficial?: boolean;
}

const ServerCard = ({ title, description, isOfficial }: ServerCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-all">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            {isOfficial && (
              <Badge variant="secondary" className="font-medium">
                Official
              </Badge>
            )}
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
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4">
              {isOfficial && (
                <Badge variant="secondary" className="font-medium">
                  Official
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServerCard;
