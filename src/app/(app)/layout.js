'use client'

import { useAuth } from '@/hooks/auth'
import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import Sidebar from './Sidebar'

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            {/* <Navigation user={user} /> */}

            <main className="lg:w-[calc(100vw-305px)] lg:pt-4">
                <div className="w-full lg:ml-72 max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-4 text-gray-900">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default AppLayout
