import DataTableConversion from "./DataTableConversions";

export const metadata = {
    title: 'Item',
}

const ItemId = async ({ params }) => {
    return (
        <div className="space-y-4">
            <DataTableConversion id={params.id} />
        </div>
    )
}

export default ItemId;