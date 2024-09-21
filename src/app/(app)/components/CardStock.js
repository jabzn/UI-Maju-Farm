const CardStock = () => {
    return (
        <div className="bg-gray-100 rounded-lg shadow-inner p-4 w-1/3">
            <h3 className="font-bold mb-4">Stock in Gudang</h3>

            <div className="border-b border-2 border-gray-300 my-4"></div>

            <ul className="space-y-2">
                <li className="flex justify-between">
                    <span className="font-bold">524 A</span>
                    <span className="font-bold">100</span>
                </li>
                <li className="flex justify-between">
                    <span className="font-bold">EM4</span>
                    <span className="font-bold">50</span>
                </li>
                <li className="flex justify-between">
                    <span className="font-bold">Vaksinasi</span>
                    <span className="font-bold">20</span>
                </li>
            </ul>
        </div>
    )
}

export default CardStock;