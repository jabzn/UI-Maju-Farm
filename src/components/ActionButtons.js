const ActionButtons = ({ onUpdate, onDelete, row }) => (
    <div className="flex gap-2">
        <button 
            className="bg-blue-500 text-white text-xs font-bold p-1 rounded-sm shadow-inner" 
            onClick={() => onUpdate(row)}
        >
            Update
        </button>
        <button 
            className="bg-red-500 text-white text-xs font-bold p-1 rounded-sm shadow-inner"
            onClick={() => onDelete(row)}
        >
            Hapus
        </button>
    </div>
);

export default ActionButtons