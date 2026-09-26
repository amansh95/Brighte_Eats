const API_URL = process.env.API_URL ?? "http://localhost:4000/graphql";

export const dynamic = "force-dynamic";

async function getHello(): Promise<string> {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "{ hello }" }),
    });
    const { data } = await res.json();
    return data.hello;
  } catch {
    return "Could not reach the backend.";
  }
}

export default async function Home() {
  const hello = await getHello();

  return (
    <main>
      <h1>{hello}</h1>
    </main>
  );
}
