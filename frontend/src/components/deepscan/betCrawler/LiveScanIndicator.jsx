const LiveScanIndicator = ({ resultsCount }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="relative mr-3">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
      </div>
      <p className="text-sm text-gray-600">
        Varredura em tempo real • {resultsCount} casas de apostas não
        regulamentadas detectadas
      </p>
    </div>
  );
};

export default LiveScanIndicator;
