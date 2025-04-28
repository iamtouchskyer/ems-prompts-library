import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/hooks/useLanguage";
import { fetchHistory } from "@/services/historyService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";

interface HistoryRecord {
  id: number;
  user_name: string;
  prompt_title: string;
  change_type: string;
  change_description: string;
  created_at: string;
}

const History = () => {
  const { t } = useLanguage();
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await fetchHistory();
        setHistory(data);
      } catch (err) {
        setError(t.failedToLoadHistory);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [t]);

  const getChangeTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'update':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'yyyy-MM-dd HH:mm');
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">{t.changeHistory}</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400">
            {t.noHistoryFound}
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((record) => (
              <Card key={record.id} className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`font-medium ${getChangeTypeColor(record.change_type)}`}
                    >
                      {t[record.change_type.toLowerCase()] || record.change_type}
                    </Badge>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{record.prompt_title}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(record.created_at)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{record.change_description}</p>
                <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>{t.by} {record.user_name || t.anonymous}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
