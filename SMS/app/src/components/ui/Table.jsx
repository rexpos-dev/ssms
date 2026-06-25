export const Table = ({ children }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children }) => {
  return (
    <thead className="bg-surface-container-low">
      {children}
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return (
    <tbody className="divide-y divide-surface-variant">
      {children}
    </tbody>
  );
};

export const TableRow = ({ children, className = '' }) => {
  return (
    <tr className={`hover:bg-tertiary/5 transition-colors ${className}`}>
      {children}
    </tr>
  );
};

export const TableHeader = ({ children, align = 'left' }) => {
  return (
    <th className={`px-xl py-md font-label-sm text-label-sm uppercase text-on-surface-variant text-${align}`}>
      {children}
    </th>
  );
};

export const TableCell = ({ children, align = 'left' }) => {
  return (
    <td className={`px-xl py-md font-body-md text-body-md text-${align}`}>
      {children}
    </td>
  );
};

export default Table;
