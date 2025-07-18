'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname(); 
  const {replace} = useRouter();

  // useDebouncedCallback wrap the contents of handleSearch and only runs after specified time (300ms)
  const handleSearch = useDebouncedCallback((term:string) => {
    console.log(`Searching ...${term}`);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // Reset to page 1 when searching
    
    // set the params string based on the user’s input.
    if(term){
      params.set('query', term)
    }else{
      params.delete('query');
    }
    // updates the URL with the user's search data, /dashboard/invoices?query=lee if user search lee
    // url updated without reloading the page (nextjs client side navigation)
    replace(`${pathname}?${params.toString()}`); 
    // ${pathname} Get the current pathname "/dashboard/invoices"
    // params.toString() translates this input into a URL-friendly format
    
  },300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue = {searchParams.get('query') ?.toString()} 
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
