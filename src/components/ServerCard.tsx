
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ServerCardProps {
  title: string;
  description: string;
  isOfficial?: boolean;
}

const ServerCard = ({ title, description, isOfficial }: ServerCardProps) => {
  return (
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
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServerCard;
