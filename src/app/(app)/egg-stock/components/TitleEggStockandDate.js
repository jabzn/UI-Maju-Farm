const FilterDate = ({ title, startDate, endDate, setStartDate, setEndDate }) => {
    return (
        <div className="flex lg:justify-start justify-between items-center space-x-6 mb-4">
            <h3 className="font-bold text-lg ">
                {title}
            </h3>

            <div className="flex items-center space-x-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="border rounded-md px-2 py-1 outline-none shadow-inner"
                />
                <span className="text-gray-700">s/d</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="border rounded-md px-2 py-1 outline-none shadow-inner"
                />
            </div>
        </div>
    )
}

export default FilterDate