// src/components/FundCard.js
import Link from "next/link";

export function FundCard({ scheme }) {
  return (
    <Link href={`/scheme/${scheme.schemeCode}`} passHref>
      <div className="block cursor-pointer bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {scheme.schemeName}
        </h3>
      </div>
    </Link>
  );
}