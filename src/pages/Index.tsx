import { useState } from "react";
import Navigation from "../components/Navigation";
import ServerCard from "../components/ServerCard";
import FilterTags from "../components/FilterTags";

const tags = [
  "All",
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
    isOfficial: true,
    tags: ["Edge", "Engineer"]
  },
  {
    title: "AWS Bedrock KB Retrieval",
    description: "Query Amazon Bedrock Knowledge Bases using natural language to retrieve relevant information from your data sources.",
    isOfficial: true,
  },
  {
    title: "AWS CDK",
    description: "Get prescriptive CDK advice, explain CDK Nag rules, check suppressions, generate Bedrock Agent schemas, and discover AWS Solutions Constructs patterns.",
    isOfficial: true,
  },
];

const Index = () => {
  const [selectedTag, setSelectedTag] = useState("All");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ✨ New: Remote Prompts
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            EMS Prompt Library
          </h1>
          <p className="text-xl text-gray-600">
            A collection of prompts
          </p>
        </div>

        <FilterTags
          tags={tags}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
          {servers.map((server) => (
            <ServerCard
              key={server.title}
              title={server.title}
              description={server.description}
              isOfficial={server.isOfficial}
              tags={server.tags}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
