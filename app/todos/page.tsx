import ClientTodos from "@/components/todos/client-todos";
import ServerTodos from "@/components/todos/server-todos";
import DisplayUser from "@/components/display-user";

export default async function Index({ searchParams }: { searchParams: any }) {
  const params = await searchParams;

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row">
          <div className="flex-1 bg-blue-100 p-4">
            <ServerTodos searchParams={params} />
          </div>
          <div className="flex-1 bg-orange-100 p-4">
            <ClientTodos />
          </div>
        </div>
      </div>
    </>
  );
}
