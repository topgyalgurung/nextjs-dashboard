'use server';

import {string, z} from 'zod';
import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation';
import postgres from 'postgres';
import { signIn } from '@/app/auth';
import { AuthError } from 'next-auth';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const FormSchema = z.object({
    id:z.string(),
    customerId: z.string({
        invalid_type_error: "Please select a customer",
    }),
    amount: z.coerce.number()
        .gt(0, {message: "Please enter an amount greater than 0"}),
    status:z.enum(['pending', 'paid'],{
        invalid_type_error: "Please select an invoice status",
    }),
    date:z.string(),
})

export type State ={
    errors?:{
        customerId?:string[];
        amount?:string[];
        status?:string[];
    };
    message?:string | null;
}

// use zod to update expected types
const CreateInvoice = FormSchema.omit({id:true, date:true});
const UpdateInvoice = FormSchema.omit({id:true, date:true});

export async function createInvoice( prevState: State, formData: FormData){
    // safeParse return object success or error, will help handle more gracefully without try catch block
    const validateFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status'),
    });

    if(!validateFields.success){
        // console.log(validateFields);
        return {
            errors:validateFields.error.flatten().fieldErrors,
            message: 'Missing fields. Failed to create invoice.',
        }
    }

    // prepare data for insertion into db
    const {customerId, amount, status} = validateFields.data;

    // It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

    // if working with many fields, you can use Object.fromEntries(formData.entries()) to convert FormData to an object
    try {
        await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date});
        `;
    }catch(error){
        // log error for now 
        console.error(error)
    }
    // handle errors later
    // once db updated, the path will be revalidated and fresh data fetched from server 
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');

}

 
export async function updateInvoice(id: string, prevState:State, formData: FormData) {

    const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
 
    if(!validatedFields.success){
        return{
            errors:validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to updated invoice',
        }
    }

    const {customerId, amount, status} = validatedFields.data;

    const amountInCents = amount * 100;
    try{
        await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
    }catch(error){
        return{message: "Database Error: Failed to Update Invoice"}
    }
    
    revalidatePath('/dashboard/invoices'); // clear cache and make new server request
    redirect('/dashboard/invoices'); // redirect to invoices page
}

export async function deleteInvoice(id:string){
    // throw new Error('Failed to delete invoice'); // for now, throw error to test error boundary

    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices'); // clear cache and make new server request
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
){
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
        switch (error.type) {
            case 'CredentialsSignin':
            return 'Invalid credentials.';
            default:
            return 'Something went wrong.';
        }
        }
        throw error;
    }
}