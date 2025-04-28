
export interface ServerCardProps {
  id: string;
  title: string;
  description: string;
  author?: string;
  tags?: string[];
  isNew?: boolean;
}

export const allTags = [
  "Edge",
  "Copilot", 
  "SuperApp",
  "Engineer",
  "PM",
  "Designer",
  "Testing"
];
