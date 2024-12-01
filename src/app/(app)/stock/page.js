import { ArchiveBoxIcon } from "@heroicons/react/24/solid";
import BoxButton from "../components/BoxButton";
import DatatableStock from "./components/DataTableStock";

export const metadata = {
    title: 'Stock Maju Farm',
}

const Stock = () => {
    return (
        <>
            <div className="mt-2">
                <DatatableStock />
            </div>
        </>
    )
}

export default Stock;