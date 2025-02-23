import EggStockStore from "../egg-stock/components/egg-stocks";

export const metadata = {
    title: 'Maju Farm - Stock Telur',
}

const EggStock = () => {
    return (
        <>
            <EggStockStore />
        </>
    )
}

export default EggStock;