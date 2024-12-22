"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CalendarIcon,
  File,
  Loader2,
  Upload,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns/format";
import { Calendar } from "@/components/ui/calendar";
import { error } from "console";
import { toast } from "sonner";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const expenseFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title must be less than 50 characters" }),
  amount: z
    .number({ required_error: "What's the amount?" })
    .positive({ message: "Amount must be positive" })
    .int({ message: "Amount must be integer" })
    .or(z.string())
    .pipe(
      z.coerce
        .number({ required_error: "What's the amount?" })
        .positive({ message: "Amount must be positive" })
        .int({ message: "Amount must be integer" })
    ),
  description: z
    .string()
    .max(500, { message: "Description must be less than 200 characters" })
    .optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  receipt: z
    .custom<FileList>()
    .refine(
      (files) => files?.length === 0 || files?.length === 1,
      "Please upload one file"
    )
    .refine((files) => {
      if (files?.length === 0) return true;
      return files?.[0]?.size <= MAX_FILE_SIZE;
    }, `Max file size is 5MB`)
    .refine((files) => {
      if (files?.length === 0) return true;
      return ACCEPTED_FILE_TYPES.includes(files?.[0]?.type);
    }, "Only .jpg, .png, and .pdf files are accepted")
    .optional(),
  members: z
    .array(z.string())
    .min(1, { message: "At least one member must be involved in the expense" }),
});

type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export default function NewExpensePage() {
  const { user } = useUser();
  if (!user) {
    redirect("/sign-in");
  }

  const router = useRouter();
  const params = useParams();
  const trip_id = params.tripId;

  const currentUser = user.username!!;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allMembersSelected, setAllMembersSelected] = useState(false);

  const fetchMembers = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/${trip_id}/members`
      );
      if (!res.ok) {
        throw new Error("Error fetching trip members. Please try again later.");
      }
      const data = (await res.json()) as string[];
      setMembers(data);
      // setFilteredMembers([]);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: "",
      amount: 1,
      description: "",
      members: [currentUser], // Current user is selected by default
    },
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = members.filter(
      (member) =>
        member.toLowerCase().includes(term.toLowerCase()) ||
        member.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredMembers(filtered);
  };

  const handleSelectAll = () => {
    setAllMembersSelected(true);
    form.setValue("members", members);
  };

  const handleDeselectAll = () => {
    setAllMembersSelected(false);
    form.setValue("members", [currentUser]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  };

  async function onSubmit(formData: ExpenseFormValues) {
    try {
      setIsSubmitting(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trip/${trip_id}/expense`,
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast("Error", {
          description: data.message,
          icon: "❌",
        });
      } else {
        toast("Expense has been created", {
          icon: "✅",
        });
        router.replace(`/trip/${trip_id}`);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2">
            <Link
              href={`/trip/${trip_id}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Trip Details
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Add New Expense</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dinner at Restaurant"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter a clear title for the expense
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <Wallet className="mr-1 h-4 w-4" />
                            </span>
                            <Input
                              type="number"
                              step="1.00"
                              min="0"
                              className="pl-8"
                              placeholder="0.00" // your defaultValue must be undefined
                              inputMode="numeric" // display numeric keyboard on mobile
                              {...field}
                              value={field.value || ""} // avoid errors of uncontrolled vs controlled
                              pattern="[0-9]*" // to receive only numbers without showing does weird arrows in the input
                              onChange={
                                (e) =>
                                  e.target.validity.valid &&
                                  field.onChange(e.target.value) // e.target.validity.valid is required for pattern to work
                              }
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter the total amount of the expense
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={"w-full pl-3 text-left font-normal"}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select the date when the expense occurred
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="members"
                    render={() => (
                      <FormItem>
                        <FormLabel>Members Involved</FormLabel>
                        <FormDescription>
                          Select the members involved in this expense
                        </FormDescription>
                        <div className="mt-2">
                          <ScrollArea className="h-72 rounded-md border">
                            <div className="p-4">
                              <div className="flex gap-2 mb-4">
                                <Input
                                  placeholder="Search members..."
                                  value={searchTerm}
                                  onChange={(e) => handleSearch(e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={
                                    allMembersSelected
                                      ? handleDeselectAll
                                      : handleSelectAll
                                  }
                                >
                                  {allMembersSelected
                                    ? "Deselect All"
                                    : "Select All"}
                                </Button>
                              </div>
                              {filteredMembers &&
                                filteredMembers.length > 0 &&
                                filteredMembers.map((member) => (
                                  <FormField
                                    key={member}
                                    control={form.control}
                                    name="members"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={member}
                                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-2 last:mb-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                member
                                              )}
                                              onCheckedChange={(checked) => {
                                                const currentValue =
                                                  field.value || [];
                                                if (
                                                  checked &&
                                                  !currentValue.includes(member)
                                                ) {
                                                  field.onChange([
                                                    ...currentValue,
                                                    member,
                                                  ]);
                                                } else if (
                                                  !checked &&
                                                  currentValue.length > 1
                                                ) {
                                                  field.onChange(
                                                    currentValue.filter(
                                                      (member) =>
                                                        member !== member
                                                    )
                                                  );
                                                }
                                              }}
                                              disabled={
                                                member === currentUser ||
                                                (field.value?.length === 1 &&
                                                  field.value?.includes(member))
                                              }
                                            />
                                          </FormControl>
                                          <div className="flex items-center gap-2">
                                            <div className="space-y-1">
                                              <div className="text-sm font-medium leading-none">
                                                {member}
                                                {member === currentUser && (
                                                  <Badge
                                                    variant="secondary"
                                                    className="ml-2"
                                                  >
                                                    You
                                                  </Badge>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              {filteredMembers &&
                                filteredMembers.length === 0 && (
                                  <p className="text-center text-sm text-muted-foreground py-4">
                                    No members found
                                  </p>
                                )}
                            </div>
                          </ScrollArea>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional details about the expense..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide any additional context for this expense
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="receipt"
                    render={({ field: { value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Receipt (Optional)</FormLabel>
                        <FormControl>
                          <div className="grid gap-4">
                            <Input
                              type="file"
                              accept={ACCEPTED_FILE_TYPES.join(",")}
                              className="cursor-pointer"
                              onChange={(e) => {
                                handleFileChange(e);
                                onChange(e.target.files);
                              }}
                              {...field}
                            />
                            {previewUrl && (
                              <div className="relative w-40">
                                <img
                                  src={previewUrl}
                                  alt="Receipt preview"
                                  className="rounded-lg border"
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="absolute -right-2 -top-2"
                                  onClick={() => {
                                    setPreviewUrl(null);
                                    onChange(new DataTransfer().files);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Remove image</span>
                                </Button>
                              </div>
                            )}
                            {!previewUrl &&
                              value?.[0]?.type === "application/pdf" && (
                                <div className="flex items-center gap-2 rounded-lg border p-2">
                                  <File className="h-4 w-4" />
                                  <span className="text-sm">
                                    {value[0].name}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="icon"
                                    className="ml-auto h-8 w-8"
                                    onClick={() => {
                                      onChange(new DataTransfer().files);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Remove file</span>
                                  </Button>
                                </div>
                              )}
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a receipt image (JPG, PNG) or PDF. Maximum
                          size: 5MB
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Expense
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.replace(`/trip/${trip_id}`)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
