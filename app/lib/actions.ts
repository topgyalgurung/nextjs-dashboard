'use server';

import {z} from 'zod';
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id:z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status:z.enum(['pending', 'paid']),
    date:z.string(),
})

const CreateInvoice = FormSchema.omit({id:true, date:true});

export async function createInvoice(formData: FormData){
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status'),
    });
    // It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

    // if working with many fields, you can use Object.fromEntries(formData.entries()) to convert FormData to an object

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date});
    `;
    // handle errors later
    // once db updated, the path will be revalidated and fresh data fetched from server 
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}