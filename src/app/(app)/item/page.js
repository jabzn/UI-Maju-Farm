import ItemsTable from "./components/DataTableItem";
import FormItem from "./components/FormItem";
import CreateItemModal from "./components/Modal";

export const metadata = {
    title: 'Maju Farm - Items',
}

const Items = () => {
    return (
        <div>
            <CreateItemModal 
                title={'Tambah Item'}
                header={'Tambah Item'}
                content={<FormItem />}
            />
            
            <ItemsTable />
        </div>
    )
}

export default Items;
