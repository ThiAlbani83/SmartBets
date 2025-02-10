import trash from '../../assets/delete.png'

const SearchDeepScan = () => {
  return (
    <div className="w-full h-full flex relative font-roboto">
      <div className="flex w-full flex-wrap gap-10 overflow-y-auto overflow-hidden">
        <div className="flex flex-col gap-6">
          <h3>Perfis a serem verificados</h3>
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Digite o nome do perfil"
              className="border-b border-b-linesAndBorders p-1"
            />
            <button>
              <img src={trash} alt="trash" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute -top-28 -left-10 px-5 py-2 z-50 border border-linesAndBorders rounded-xl shadow-sm">
        <h2 className="text-mainText font-bold">Varredura - DeepScan360</h2>
      </div>
    </div>
  );
};

export default SearchDeepScan;
