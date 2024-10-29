import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";

const Modal = ({ isOpen, onClose, title, width = 'max-w-md', children }) => (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={onClose} className="relative z-10">
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
        </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child 
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className={`w-full ${width} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all`}>
                            <Dialog.Title className="text-lg font-bold leading-6 text-gray-900 flex justify-between border-b-2 pb-2">
                                <span>{title}</span>
                                <button className="hover:text-red-800" onClick={onClose}>
                                    <XMarkIcon className="w-5" />
                                </button>
                            </Dialog.Title>
                            <div className="mt-4">
                                {children}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>
);

export default Modal;