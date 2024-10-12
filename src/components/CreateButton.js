import { PlusIcon } from "@heroicons/react/24/solid";

const CreateButton = ({ onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className="mb-4 px-4 py-2 bg-gray-800 text-white text-sm font-semibold shadow-lg rounded-md flex justify-between items-center space-x-2 hover:bg-gray-700 duration-200"
        >
            <span>{ children }</span>
            <PlusIcon className="w-5 h-5" />
        </button>
    )
}

export default CreateButton;