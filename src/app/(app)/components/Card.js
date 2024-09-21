const Card = ({title, value}) => {
    return (
        <div className="bg-gray-100 px-3 py-4 rounded-lg flex justify-between items-center shadow-inner">
            <h3 className="font-bold">
                {title}
            </h3>
            <div className="text-3xl font-bold">
                {value}
            </div>
        </div>
    )
}

export default Card;