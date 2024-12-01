import { memo } from "react";

export const InputField = memo(({ label, name, value, type = "text", disabled, onChange, error, className, ...props }) => (
    <div className={className}>
        <label className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <input 
            type={type}
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-inner
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

export const SelectField = memo(({ label, name, value, options, disabled, onChange, error, className, ...props }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-inner
                focus:ring-blue-500 focus:border-blue-500
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            disabled={disabled}
            onChange={onChange}
            {...props}
        >
            <option value="">Pilih {label}</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name ? option.name : option.quantity + " | " + option.unit.name }
                </option>
            ))}
        </select>
        {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
));

export const SelectFieldUom = memo(({ label, name, value, disabled, onChange, error, className, children, ...props }) => (
    <div className={className}>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <select
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-inner
                focus:ring-blue-500 focus:border-blue-500
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            disabled={disabled}
            onChange={onChange}
            {...props}
        >
            { children }
        </select>
        {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
));

export const TextArea = memo(({ label, name, value, disabled, onChange, error, ...props }) => (
    <div {...props}>
        <label htmlFor={name} className="block text-sm font-bold text-gray-700">
            {label}
        </label>
        <textarea 
            id={name}
            name={name}
            value={value}
            className={`
                mt-1 text-sm block w-full px-2 py-2 border border-gray-300 rounded-md shadow-inner
                focus:ring-blue-500 focus:border-blue-500 h-48
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
            disabled={disabled}
            onChange={onChange}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
));

export const DeleteConfirmation = memo(({ label }) => (
    <div className="text-red-500">
        <p>Ingin menghapus <strong>"{label}"</strong>?</p>
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