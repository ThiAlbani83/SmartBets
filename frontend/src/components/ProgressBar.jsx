const ProgressBar = ({ progress }) => {
  return (
    <div className="w-[250px] bg-gray-300 rounded-full h-4">
      <div
        className="bg-green-600 h-4 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
