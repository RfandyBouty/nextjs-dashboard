'use server'
import { z } from 'zod'
import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// validating input
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.string(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
})

const CreateInvoice = FormSchema.omit({
    id: true,
    date: true
})

export async function createInvoice(formData: FormData) {
    const {customerId, amount, status} = CreateInvoice.parse({ 
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status')
    })
    const amountInCents = Number(amount) * 100
    const date = new Date().toISOString().split('T')[0]

    // insert to sql
    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date}) `

    // revalidate and redirect to
    revalidatePath('/dashboard/invoices')
    redirect('/dashboard/invoices')
}