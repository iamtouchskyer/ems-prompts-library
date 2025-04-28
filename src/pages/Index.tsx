
import { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import ServerCard from "@/components/server-card/ServerCard";
import FilterTags from "../components/FilterTags";
import { useLanguage } from "@/components/Navigation";
import CreateNewCard from "@/components/server-card/CreateNewCard";
import { supabase } from "@/integrations/supabase/client";

const tags = [
  "Edge",
  "Copilot", 
  "SuperApp",
  "Engineer",
  "PM",
  "Designer",
  "Testing"
];

const Index = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [prompts, setPrompts] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchPrompts = async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select(`
          *,
          users:author_id (
            username
          )
        `);

      if (error) {
        console.error('Error fetching prompts:', error);
        return;
      }

      setPrompts(data);
    };

    fetchPrompts();

    // Subscribe to changes
    const channel = supabase
      .channel('public:prompts')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'prompts' 
      }, () => {
        fetchPrompts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
          {prompts.map((prompt) => (
            <ServerCard
              key={prompt.id}
              id={prompt.id}
              title={prompt.title}
              description={prompt.content}
              author={prompt.users?.username}
              tags={prompt.tags || []}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
