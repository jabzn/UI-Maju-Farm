import { memo } from "react";

export const InputField = memo(({ label, name, value, type = "text", disabled, onChange, error, ...props }) => (
    <div>
        <label className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <input 
            type={type}
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-1 border border-gray-300 rounded-md shadow-inner
                focus:ring-blue-500 focus:border-blue-500
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            disabled={disabled}
            onChange={onChange}
            {...props}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
));

export const SelectField = memo(({ label, name, value, options, disabled, onChange, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-1 border border-gray-300 rounded-md shadow-inner
                focus:ring-blue-500 focus:border-blue-500
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            disabled={disabled}
            onChange={onChange}
            required
        >
            <option value="">Pilih {label}</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
        {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
));

export const TextArea = memo(({ label, name, value, disabled, onChange, error }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <textarea 
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-1 border border-gray-300 rounded-md shadow-inner
                focus:ring-blue-500 focus:border-blue-500 h-18
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            disabled={disabled}
            onChange={onChange}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
));

export const DeleteConfirmation = memo(({ itemName }) => (
    <div className="text-red-500">
        <p>Ingin menghapus <strong>"{itemName}"</strong> dari list Item?</p>
    </div>
));

export const SubmitButton = memo(({ isValid, isLoading, mode, buttonText }) => (
    <button 
        type="submit" 
        className={`
            px-4 py-2 text-white rounded-md
            ${mode === 'delete' ? 'bg-red-500 hover:bg-red-900' : 'bg-blue-500 hover:bg-blue-900'}
            ${(!isValid || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        disabled={!isValid || isLoading}
    >
        {buttonText}
    </button>
));