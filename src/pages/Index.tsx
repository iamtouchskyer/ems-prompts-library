
import { useState } from "react";
import Navigation from "../components/Navigation";
import ServerCard from "@/components/server-card/ServerCard";
import FilterTags from "../components/FilterTags";
import { useLanguage } from "@/components/Navigation";
import CreateNewCard from "@/components/server-card/CreateNewCard";

const tags = [
  "Edge",
  "Copilot", 
  "SuperApp",
  "Engineer",
  "PM",
  "Designer",
  "Testing"
];

const servers = [
  {
    title: "Aiven",
    description: "Navigate your Aiven projects and interact with the PostgreSQL®, Apache Kafka®, ClickHouse® and OpenSearch® services",
    author: "John Doe",
    tags: ["Edge", "Engineer"]
  },
  {
    title: "AWS Bedrock KB Retrieval",
    description: "Query Amazon Bedrock Knowledge Bases using natural language to retrieve relevant information from your data sources.",
    author: "Jane Smith",
  },
  {
    title: "AWS CDK",
    description: "Get prescriptive CDK advice, explain CDK Nag rules, check suppressions, generate Bedrock Agent schemas, and discover AWS Solutions Constructs patterns.",
    author: "Mike Johnson",
  },
];

const Index = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ✨ Thanks Jingxia ✨
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t.library}
          </h1>
          <p className="text-xl text-gray-600">
            {t.collection}
          </p>
        </div>

        <FilterTags
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          <div className="h-full">
            <CreateNewCard />
          </div>
          {servers.map((server) => (
            <ServerCard
              key={server.title}
              title={server.title}
              description={server.description}
              author={server.author}
              tags={server.tags}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
