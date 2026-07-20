import { cookies } from "next/headers";

import { createClient } from "@/utils/supabase/server";

export default async function SupabasePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: courses, error } = await supabase
    .from("courses")
    .select("id, title, slug, status")
    .order("title", { ascending: true });

  return (
    <main style={{ padding: "32px" }}>
      <h1>Supabase Courses</h1>
      {error ? <p>{error.message}</p> : null}
      <ul>
        {courses?.map((course) => (
          <li key={course.id}>
            {course.title} ({course.slug}) - {course.status}
          </li>
        ))}
      </ul>
    </main>
  );
}
