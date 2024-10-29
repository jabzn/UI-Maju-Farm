import DataTableItem from "./components/DataTableItems";

export const metadata = {
    title: 'Item',
}

const Item = () => {
    return (
        <div className="space-y-4">
            <DataTableItem />
        </div>
    )
}

export default Item;