import { useSearchParams } from "react-router";

function StatusFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "all";

  function handleStatusChange(status) {
    const nextParams = new URLSearchParams(searchParams);

    if (status === "all") {
      nextParams.delete("status");
    } else {
      nextParams.set("status", status);
    }

    setSearchParams(nextParams);
  }

  return (
    <div>
      <label htmlFor="statusFilter">Show:</label>
      <select
        id="statusFilter"
        value={currentStatus}
        onChange={(event) => handleStatusChange(event.target.value)}
      >
        <option value="all">All Todos</option>
        <option value="active">Active Todos</option>
        <option value="completed">Completed Todos</option>
      </select>
    </div>
  );
}

export default StatusFilter;
