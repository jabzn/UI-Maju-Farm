import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
    const listRoutes = [
        {
            'route_link': '/dashboard',
            'route_name': 'Dashboard',
        },
        {
            'route_link': '/gudang',
            'route_name': 'Gudang', 
        },
        {
            'route_link': '/users',
            'route_name': 'Users',
        },
    ];

    const listSubRoutes = [
        {
            'route_link': '/category',
            'route_name': 'Category',
        },
        {
            'route_link': '/item',
            'route_name': 'Item',
        },
    ];

    return (
        <aside className="hidden lg:block fixed ml-4 mt-4 bg-blue-300 h-[calc(100vh-32px)] w-72 py-6 rounded-lg shadow-lg">
            <Link href="/dashboard">
                <h6 className="text-center block antialiased tracking-normal font-sans text-xl font-extrabold leading-relaxed text-blue-gray-900">
                    Maju Farm
                </h6>
            </Link>

            <div className="m-4">
                <ul className="mb-4 flex flex-col gap-1">
                    {listRoutes.map(route => (
                        <li key={route.route_link}>
                            <Link href={route.route_link}>
                                <div className={`align-middle select-none font-sans font-bold text-center transition-all text-lg py-3 rounded-lg hover:bg-gray-400 active:bg-gray-500/30 w-full flex items-center gap-4 px-4 capitalize 
                                    ${
                                        usePathname() === route.route_link 
                                        && 'bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg'
                                }`}>
                                    {route.route_name}
                                </div>
                            </Link>
                        </li>
                    ))}
                        <li>
                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="align-middle select-none font-sans font-bold text-center transition-all text-lg py-3 rounded-lg hover:bg-gray-400 active:bg-gray-500/30 w-full flex items-center gap-4 px-4 capitalize justify-between">
                                            <span>Master Data</span>
                                            <ChevronUpIcon className={`${open ? 'rotate-180 transform duration-100' : ''} h-5 w-5`} />
                                        </Disclosure.Button>
                                        <Disclosure.Panel>
                                            <ul className="bg-blue-200 rounded-lg">
                                                {listSubRoutes.map(route => (
                                                    <Link href={route.route_link} key={route.route_link}>
                                                        <li className={`align-middle select-none font-sans font-bold text-center transition-all text-md py-2 rounded-lg hover:bg-gray-400 active:bg-gray-500/30 w-full flex items-center gap-4 px-4 capitalize
                                                            ${
                                                                usePathname() === route.route_link
                                                                && 'bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg'
                                                            }
                                                        `}>{route.route_name}</li>
                                                    </Link>    
                                                ))}
                                            </ul>
                                        </Disclosure.Panel>
                                    </>
                                )}
                            </Disclosure>
                        </li>
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar;