interface PaginationSettingsProps {
  currentLimit: number;
  onLimitChange: (limit: number) => void;
  totalCount: number;
}

export default function PaginationSettings({
  currentLimit,
  onLimitChange,
  totalCount,
}: PaginationSettingsProps) {
  const limitOptions = [5, 10, 20, 50];

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>Show</span>
      <select
        value={currentLimit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border border-gray-300 rounded px-2 py-1 text-sm"
      >
        {limitOptions.map((limit) => (
          <option key={limit} value={limit}>
            {limit}
          </option>
        ))}
      </select>
      <span>per page</span>
      {totalCount > 0 && (
        <span className="ml-2 text-gray-500">
          ({totalCount} total)
        </span>
      )}
    </div>
  );
}
