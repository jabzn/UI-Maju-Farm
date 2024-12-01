const BoxButton = ({ children, title }) => (
    <button className="text-sm font-bold text-center my-0 items-center border border-gray-300 w-20 py-2 rounded-lg shadow-inner shadow-md hover:bg-gray-700 hover:text-white duration-200 hover:scale-105">
        {children}
        <span>{title}</span>
    </button>
)

export default BoxButton;