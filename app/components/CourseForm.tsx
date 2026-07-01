"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// تعریف اسکیمای اعتبارسنجی با زاد
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  instructor: z.string().min(2, "Instructor name must be at least 2 characters"),
})

type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormProps {
  defaultValues?: CourseFormValues
  onSubmit: (values: CourseFormValues) => Promise<void>
  submitText?: string
}

export default function CourseForm({
  defaultValues,
  onSubmit,
  submitText = "Submit",
}: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: defaultValues || {
      title: "",
      instructor: "",
    },
  })

  // برای اینکه وقتی مقادیر دیفالت در ادیت تغییر کرد، فرم بروزرسانی بشه
  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form])

  const handleSubmit = async (values: CourseFormValues) => {
    await onSubmit(values)
    if (!defaultValues) {
      form.reset() // اگر فرم ثبت جدید بود، بعد از ثبت فیلدها خالی بشن
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Next.js Mastery" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instructor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instructor</FormLabel>
              <FormControl>
                <Input placeholder="e.g. John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : submitText}
        </Button>
      </form>
    </Form>
  )
}
