import '../styles/AdminTable.css';

const AdminTable = ({
  headers = [],
  rows = [],
  onRowClick = null,
  actions = null,
  loading = false,
  emptyMessage = 'No data available'
}) => {
  if (loading) {
    return (
      <div className="admin-table-loading">
        <div className="admin-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="admin-table-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className={`admin-th admin-th-${header.key}`}>
                {header.label}
              </th>
            ))}
            {actions && <th className="admin-th admin-th-actions">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={rowIdx}
              className="admin-tr"
              onClick={() => onRowClick && onRowClick(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {headers.map((header, cellIdx) => (
                <td key={cellIdx} className={`admin-td admin-td-${header.key}`}>
                  {row[header.key] !== undefined && row[header.key] !== null
                    ? row[header.key]
                    : '-'}
                </td>
              ))}
              {actions && (
                <td className="admin-td admin-td-actions">
                  <div className="admin-actions">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
