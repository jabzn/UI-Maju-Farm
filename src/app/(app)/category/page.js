import DataTablesCategories from "./components/DataTablesCategories";

export const metadata = {
    title: 'Maju Farm - Category',
}

const Category = () => {
    return (
        <div className="space-y-4">
            <DataTablesCategories />
        </div>
    )
}

export default Category;