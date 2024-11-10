import DataTableStore from "./components/DatatableStore";

export const metadata = {
    title: 'Store',
}

const Store = () => {
    return (
        <div className="space-y-4">
            <DataTableStore />
        </div>
    )
}

export default Store;