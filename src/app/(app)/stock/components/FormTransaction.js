import { useCallback, useMemo, useState } from "react";
import { DeleteConfirmation, InputField, SelectField, SelectFieldUom, SubmitButton } from "../../components/FieldForm";
import axios from "@/lib/axios";
import DataTable from "react-data-table-component";
import CustomStylesTransaction from "./CustomStylesTransaction";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

const INITIAL_STOCK_MOVEMENT_STATE = {
    id: '',
    item: [],
    itemName: '',
    uom: '',
    price: '',
    total_price: '',
    quantity: '',
    total_quantity: '',
    note: '',
}

const FormTransaction = ({ onSubmit, data, dataSuppliers, dataItems, mode, buttonText }) => {
    const [formData, setFormData] = useState(data);
    const [stockMovement, setStockMovement] = useState(INITIAL_STOCK_MOVEMENT_STATE);
    const [item, setItem] = useState('');
    const [conversions, setConversions] = useState([]);
    const [stockMovements, setStockMovements] = useState(data.stock_movements || []);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    }, [errors]);

    const handleItemChange = useCallback((e) => {
        const { name, value } = e.target;
        setStockMovement(prev => ({
            ...prev,
            [name]: value
        }));
    })

    const handleSelectedItem = useCallback((e) => {
        const selectedItem = e.target.value;
        const item = dataItems.find(item => item.id === parseInt(selectedItem));

        setItem(item);
        setStockMovement(prev => ({
            ...prev,
            item: item,
            itemName: selectedItem,
            uom: '',
            quantity: '',
            total_quantity: '',
        }));
        
        if (item) {
            setConversions(item.conversions || []);
        } else {
            setConversions([]);
        }
    }, [dataItems]);

    const handleQuantityChange = useCallback((e) => {
        const quantity = parseFloat(e.target.value);
        const conversionQuantity = parseFloat(stockMovement.uom) || 0;
        const totalQuantity = quantity * conversionQuantity;
        const price = parseFloat(stockMovement.price);
        const total = isNaN(price) ? 0 : price * quantity;

        setStockMovement(prev => ({
            ...prev,
            price: price,
            total_price: isNaN(total) ? 0 : total,
            quantity: quantity,
            total_quantity: isNaN(totalQuantity) ? 0 : totalQuantity,
        }))
    }, [stockMovement.uom]);

    const handleUomChange = useCallback((e) => {
        const conversionQuantity = parseFloat(e.target.value) || 0;
        const quantity = parseFloat(stockMovement.quantity) || 0;
        const totalQuantity = quantity * conversionQuantity;

        setStockMovement(prev => ({
            ...prev,
            uom: e.target.value,
            total_quantity: isNaN(totalQuantity) ? 0 : totalQuantity
        }));
    }, [stockMovement.quantity]);

    const handlePriceChange = useCallback((e) => {
        const price = parseFloat(e.target.value);
        const total = isNaN(price) ? 0 : price * stockMovement.quantity;

        setStockMovement(prev => ({
            ...prev,
            price: price,
            total_price: isNaN(total) ? 0 : total
        }));
    }, [stockMovement.quantity, stockMovement.total_price]);

    const handleTotalPriceChange = useCallback((e) => {
        const totalPrice = parseFloat(e.target.value);
        const price = isNaN(totalPrice) ? 0 : totalPrice / stockMovement.quantity;

        setStockMovement(prev => ({
            ...prev,
            total_price: totalPrice,
            price: isNaN(price) ? 0 : price
        }));
    }, [stockMovement.quantity, stockMovement.price]);

    const isDisableAddItem = useMemo(() => {
        return !stockMovement.itemName || !stockMovement.quantity || !stockMovement.uom || !stockMovement.price || !stockMovement.total_price;
    }, [stockMovement]);

    const handleAddItem = useCallback(() => {
        if (isDisableAddItem) return;

        setStockMovements(prev => {
            const newStockMovement = {
                ...stockMovement,
                id: prev.length ? Math.max(...prev.map(item => item.id)) + 1 : 1
            };
            return [...prev, newStockMovement];
        });
        setStockMovement(INITIAL_STOCK_MOVEMENT_STATE);
    }, [stockMovement, isDisableAddItem]);

    const handleDeleteItem = useCallback((row) => {
        setStockMovements(prev => prev.filter(movement => movement.id !== row.id));
    })

    const isFormValid = useCallback(() => {
        if (mode === 'delete') return true;
        return formData.date && formData.supplier_id;
    }, [formData, mode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            const submitData = {
                ...formData,
                stock_movements: stockMovements.map(movement => ({
                    store_id: 1,
                    item_id: movement.item.id,
                    quantity: movement.quantity,
                    total_quantity: movement.total_quantity,
                    price: movement.price,
                    total_price: movement.total_price,
                    type: 'in',
                }))
            }

            const endpoint = '/api/stockTransaction' + (mode !== 'create' ? `/${formData.id}` : '');
            const method = {
                'create': 'post',
                'update': 'put',
                'delete': 'delete'
            }[mode];

            await axios[method](endpoint, submitData);
            onSubmit();
        } catch (error) {
            const responseData = error.response?.data;
            
            if (error.response?.status === 422) {
                setErrors(responseData.errors);
            } else {
                console.error(`Error ${mode}ing Transaction:`, responseData?.message || error.message);
                setErrors({ 
                    general: 'An error occurred while processing your request.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const columns = useMemo(() => [
        {
            name: 'No',
            selector: (row, index) => index + 1,
        },
        {
            name: 'Item',
            selector: row => row.item.name,
            sortable: true,
        },
        {
            name: 'Kuantitas',
            selector: row => row.total_quantity,
            sortable: true,
        },
        {
            name: 'Unit Price',
            selector: row => row.price,
            format: row => row.price?.toLocaleString('id-ID'),
            sortable: true,
        },
        {
            name: 'Total',
            selector: row => row.total_price,
            format: row => row.total_price?.toLocaleString('id-ID'),
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <button 
                    className="bg-red-500 text-white font-bold p-1 rounded-sm shadow-inner hover:bg-red-900" 
                    type="button"
                    onClick={(e) => handleDeleteItem(row)}
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            )
        }
    ], []);

    const renderForm = () => {
        if (mode === 'delete') {
            return <DeleteConfirmation label={formData.reference_number} />;
        }

        return (
            <>
                <div className="w-full flex justify-between gap-4">
                    <InputField
                        className="w-2/4 flex items-center gap-1"
                        label="Tanggal"
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.date?.[0]}
                        required
                        placeholder="Tanggal"
                    />

                    <SelectField
                        className="w-2/4 flex items-center gap-1"
                        label="Supplier"
                        name="supplier_id"
                        value={formData.supplier_id}
                        options={dataSuppliers}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="Pilih Supplier"
                        error={errors.supplier_id?.[0]}
                        required
                    />

                    <InputField
                        className="w-full flex items-center gap-1"
                        label="Remark"
                        type="text"
                        name="remark"
                        value={formData.remark}
                        onChange={handleChange}
                        disabled={isLoading}
                        error={errors.remark?.[0]}
                        autoComplete="off"
                    />
                </div>
                
                <hr className="my-4 border-gray-300" />

                <div className="w-full flex justify-between gap-4 items-center">
                    <SelectField
                        className="w-full flex items-center gap-1"
                        label="Item"
                        name="stockMovement.item.name"
                        value={stockMovement.itemName}
                        options={dataItems}
                        onChange={handleSelectedItem}
                        disabled={isLoading}
                        placeholder="Pilih Item"
                        error={errors.item?.[0]}
                    />

                    <InputField
                        className="w-full flex items-center gap-1"
                        label="QTY"
                        type="number"
                        name="initialQuantity"
                        value={stockMovement.quantity}
                        onChange={handleQuantityChange}
                        disabled={isLoading}
                        error={errors.initialQuantity?.[0]}
                    />

                    <SelectFieldUom
                        className="w-full flex items-center gap-1"
                        label="UOM"
                        type="text"
                        name="uom"
                        value={stockMovement.uom}
                        onChange={handleUomChange}
                        disabled={isLoading}
                        error={errors.uom?.[0]}
                    >
                        <option value="">Pilih UOM</option>
                        {conversions.map((conversion) => (
                            <option key={conversion.id} value={conversion.quantity}>
                                {conversion.unit.name} ({conversion.quantity} {item.unit.name})
                            </option>
                        ))}
                    </SelectFieldUom>

                    <InputField
                        className="w-full flex items-center gap-1"
                        label="Harga"
                        type="number"
                        name="price"
                        value={stockMovement.price}
                        onChange={handlePriceChange}
                        disabled={isLoading}
                        error={errors.price?.[0]}
                    />

                    <InputField
                        className="w-full flex items-center gap-1"
                        label="Total"
                        type="number"
                        name="total_price"
                        value={stockMovement.total_price}
                        onChange={handleTotalPriceChange}
                        disabled={isLoading}
                        error={errors.price?.[0]}
                    />

                    <button 
                        className={`bg-blue-500 px-1 py-1 items-center self-bottom ${isDisableAddItem ? 'opacity-50 bg-gray-500' : ''}`}
                        onClick={handleAddItem} 
                        disabled={isDisableAddItem}
                        type="button" 
                    >
                        <PlusIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                <DataTable
                    columns={columns}
                    data={stockMovements}
                    customStyles={CustomStylesTransaction}
                    fixedHeader
                    highlightOnHover
                />
            </>
        );
    };
    
    return (
        <>
            <form className="space-y-4" onSubmit={handleSubmit}>
                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {errors.general}
                    </div>
                )}
                
                {renderForm()}

                <div className="flex justify-end space-x-3">
                    <SubmitButton
                        isValid={isFormValid()}
                        isLoading={isLoading}
                        mode={mode}
                        buttonText={buttonText}
                    />
                </div>
            </form>
        </>
    )
}

export default FormTransaction;