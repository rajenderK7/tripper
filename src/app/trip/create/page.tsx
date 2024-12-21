"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Check, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

const tripFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(50, { message: "Title must be less than 50 characters" }),
  location: z
    .string()
    .min(3, { message: "Location must be at least 3 characters long" })
    .max(50, { message: "Location must be less than 50 characters" }),
  start_date: z.date({
    required_error: "A start date is required",
  }),
  planned_dates: z
    .string()
    .min(3, { message: "Please enter the planned dates" })
    .regex(/^[A-Za-z0-9\s,-]+$/, {
      message: "Please enter a valid date range (e.g., July 15-20, 2025)",
    }),
  invitees: z.array(z.string().min(1, { message: "Username cannot be empty" })),
});

type TripFormValues = z.infer<typeof tripFormSchema>;

export default function NewTripPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInvitee, setNewInvitee] = useState("");

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: "",
      location: "",
      planned_dates: "",
      invitees: [],
    },
  });

  const invitees = form.watch("invitees");

  const handleAddInvitee = () => {
    if (!newInvitee) return;

    // Remove @ if user included it
    const username = newInvitee.startsWith("@")
      ? newInvitee.slice(1)
      : newInvitee;

    // Check for duplicates
    if (invitees.includes(username)) {
      form.setError("invitees", {
        message: "This user has already been added",
      });
      return;
    }

    username.trim();

    form.setValue("invitees", [...invitees, username]);
    setNewInvitee("");
  };

  const handleRemoveInvitee = (username: string) => {
    form.setValue(
      "invitees",
      invitees.filter((i) => i !== username)
    );
  };

  async function onSubmit(formData: TripFormValues) {
    try {
      setIsSubmitting(true);
      console.log(formData);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trip`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast("Error", {
          description: data.message,
          icon: "❌",
        });
      } else {
        toast("Trip has been created", {
          icon: "✅",
          description: `starting ${formData.start_date.toLocaleString()}`,
        });

        // Redirect to my trips page
        router.replace("/");
      }
    } catch (error) {
      console.error(error);
      toast("Error creating new trip", {
        description: "Something went wrong. Please try again.",
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container py-6">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold">Create New Trip</CardTitle>
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
                        <Input placeholder="Summer Hiking Trip" {...field} />
                      </FormControl>
                      <FormDescription>
                        Give your trip a memorable name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Manali, Rohtang, Kargil"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Where will this trip take place?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        When does the trip start?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planned_dates"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Planned Dates</FormLabel>
                      <FormControl>
                        <Input placeholder="July 15-20, 2025" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the full date range for the trip. E.g. July 15-20,
                        2025
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invitees"
                  render={() => (
                    <FormItem>
                      <FormLabel>Invitees</FormLabel>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              placeholder="Enter username"
                              value={newInvitee}
                              onChange={(e) => setNewInvitee(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddInvitee();
                                }
                              }}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={handleAddInvitee}
                            variant="secondary"
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Add invitee</span>
                          </Button>
                        </div>
                        {invitees.length > 0 && (
                          <div className="rounded-md border p-2">
                            <div className="flex flex-wrap gap-2">
                              {invitees.map((username) => (
                                <div
                                  key={username}
                                  className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1"
                                >
                                  <span className="text-xs font-medium">
                                    @{username}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={() =>
                                      handleRemoveInvitee(username)
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                    <span className="sr-only">
                                      Remove {username}
                                    </span>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <FormDescription>
                          Add usernames of people you want to invite
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Trip
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push("/trips")}
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
  );
}
