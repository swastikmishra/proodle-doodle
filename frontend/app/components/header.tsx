import {
  MdDarkMode,
  MdOutlineLightMode,
  MdAccountBalanceWallet,
} from "react-icons/md";
import { HiOutlineCurrencyDollar } from "react-icons/hi";
import Link from "next/link";
import { Wallet } from "@/app/components/popups/WalletAdapter";
export default function () {
  return (
    <header className="fixed top-0 left-0 right-0">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              NFT Marketplace
            </span>
          </Link>
          <div className="flex items-center lg:order-2">
            <button
              disabled={true}
              className="text-green-500 inline-flex items-center dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-400 dark:hover:text-white focus:ring-4 focus:ring-green-300 font-medium rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none dark:focus:ring-green-800"
            >
              <HiOutlineCurrencyDollar className="mr-2" /> USD
            </button>
            <button className="text-white bg-blue-500 inline-flex items-center dark:text-white hover:bg-blue-700 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-gray-800">
              <MdAccountBalanceWallet className="mr-2" /> Connect Wallet
            </button>
            <button
              href="#"
              className="hidden text-gray-800 text-lg dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              id="theme-toggle-dark-icon"
            >
              <MdOutlineLightMode />
            </button>
            <button
              href="#"
              className="hidden text-gray-800 text-lg dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              id="theme-toggle-light-icon"
            >
              <MdDarkMode />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
