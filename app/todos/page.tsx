import ClientTodos from "@/components/todos/client-todos";
import ServerTodos from "@/components/todos/server-todos";

export default async function Index({ searchParams }: { searchParams: any }) {
  return (
    <>
      <div className="flex flex-row">
        <div className="flex-1 bg-blue-100 p-4">
          <ServerTodos searchParams={searchParams} />
        </div>
        <div className="flex-1 bg-orange-100 p-4">
          <ClientTodos />
        </div>
      </div>
    </>
  );
}
