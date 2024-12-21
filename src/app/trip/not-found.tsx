import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center text-muted-foreground mt-10">
      <h2 className="font-semibold">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="underline">
        Return Home
      </Link>
    </div>
  );
}
