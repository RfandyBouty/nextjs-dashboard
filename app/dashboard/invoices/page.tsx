import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Invoices',
};
export default async function Page({ searchParams }: { searchParams?: { query?: string; page?: string; } }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchInvoicesPages(query);
    return (
        <div className='w-full'>
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl antialiased`}>Invoices</h1>
            </div>
            <div className="mt-4 gap-2 flex items-center justify-between">
                <Search placeholder='Search invoices...' />
                <CreateInvoice />
            </div>
            <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                {/* Pagination here */}
                <Pagination totalPages={totalPages} />
            </div>
        </div>
    )
}
