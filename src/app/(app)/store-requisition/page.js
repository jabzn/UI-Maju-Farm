import DataTableStoreRequisition from "./components/DataTableStoreRequisition";

export const metadata = {
    title: 'Store Stock',
}

const StoreRequisition = () => {
    return (
        <>
            <div className="space-y-4">
                <DataTableStoreRequisition />
            </div>
        </>
    )
}

export default StoreRequisition;