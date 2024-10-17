import DataTableSupplier from "./components/DatatablesSupplier";

export const metadata = {
    title: 'Supplier',
}

const Supplier = () => {
    return (
        <div className="space-y-4">
            <DataTableSupplier />
        </div>
    )
}

export default Supplier;