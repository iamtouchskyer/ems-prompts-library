
import Navigation from "@/components/Navigation";
import { useLanguage } from "@/components/Navigation";

const History = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">{t.changeHistory}</h1>
        <div className="space-y-4">
          {/* Example history items */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">2025-04-27 10:30</div>
            <div className="font-medium">Updated "Aiven" prompt tags</div>
            <div className="text-sm text-gray-600">Added "Engineer" tag</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
