
interface ServerCardProps {
  title: string;
  description: string;
  isOfficial?: boolean;
}

const ServerCard = ({ title, description, isOfficial }: ServerCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        {isOfficial && (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            official
          </span>
        )}
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="w-full text-center py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
        View Details
      </button>
    </div>
  );
};

export default ServerCard;
