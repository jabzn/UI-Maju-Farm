import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

const ActionButtons = ({ onUpdate, onDelete, row }) => (
    <div className="flex gap-1">
        <button 
            className="bg-blue-500 text-white text-xs font-bold p-1 rounded-sm shadow-inner" 
            onClick={() => onUpdate(row)}
        >
            <PencilSquareIcon 
                className="w-4 h-4"
            />
        </button>
        <button 
            className="bg-red-500 text-white text-xs font-bold p-1 rounded-sm shadow-inner"
            onClick={() => onDelete(row)}
        >
            <TrashIcon
                className="w-4 h-4"
            />
        </button>
    </div>
);

export default ActionButtons