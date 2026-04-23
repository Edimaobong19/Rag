function GroupTable({ groups, highlightName }) {
  const groupNames = ['North', 'West', 'East', 'South']
  const groupColors = {
    North: '#FFD700',  // Gold
    West: '#DAA520',   // Dark Gold
    East: '#FFC000',   // Yellow-Gold
    South: '#FFA500'   // Orange-Gold
  }

  console.log('GroupTable received groups:', groups)
  console.log('Highlight name:', highlightName)

  // Find the maximum number of users in any group
  const maxUsers = Math.max(...groupNames.map(g => groups[g]?.length || 0))

  return (
    <div className="group-table-container">
      <table className="group-table">
        <thead>
          <tr>
            {groupNames.map(group => (
              <th 
                key={group} 
                style={{ backgroundColor: groupColors[group] }}
              >
                {group}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {maxUsers === 0 ? (
            <tr>
              <td colSpan="4" className="empty-message">
                No assignments yet. Be the first to spin!
              </td>
            </tr>
          ) : (
            Array.from({ length: maxUsers }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {groupNames.map(group => {
                  const userName = groups[group]?.[rowIndex] || ''
                  const isHighlighted = userName === highlightName
                  return (
                    <td key={group} className={isHighlighted ? 'highlighted' : ''}>
                      {userName}
                    </td>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default GroupTable
