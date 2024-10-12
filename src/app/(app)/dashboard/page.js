import Header from '@/app/(app)/Header'
import CardCount from '@/app/(app)/components/CardCount'
import ChartLine from '@/app/(app)/components/ChartLine'
import CardStock from '../components/CardStock'

export const metadata = {
    title: 'Maju Farm - Dashboard',
}

const Dashboard = () => {
    return (
        <>
            {/* This is card for the Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <CardCount 
                    title={'Total Telur di Gudang'}
                    value={10.543}
                />
                <CardCount 
                    title={'Total Telur di Endekado'}
                    value={8.768}
                />
                <CardCount 
                    title={'Items'}
                    value={10}
                />
            </div>

            <div className="mt-4 flex space-x-4">
                {/* Summary Chart */}
                <ChartLine />

                {/* Summary stock of some items */}
                <CardStock />
            </div>
        </>
    )
}

export default Dashboard