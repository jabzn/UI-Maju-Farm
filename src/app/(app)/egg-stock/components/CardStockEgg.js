const CardStockEgg = ({ title, data, onClick }) => {
    return (
        <div className="w-full space-y-2 mb-4 border border-2 p-4">
            <h2 className="mb-2 font-semibold text-lg">{title}</h2>
            <div className="grid grid-rows-5 gap-4">
                {data.map(data => (
                    <div className="flex justify-between bg-blue-200 py-4 px-4 rounded-md shadow-md font-bold text-lg hover:scale-110 transition-all" onClick={() => onClick(data)}>
                        <h3>{data.name}</h3>
                        <h5>{data.current_stock} Rak</h5>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CardStockEgg;