function determineData(row, rowIndex) {
  if (row.every((cell) => !cell)) {
    return null;
  }
  if (row[0] && row.slice(1).every((cell) => !cell)) {
    // value in first cell but not any others = heading
    return <th colSpan={row.length}>{row[0].toUpperCase()}</th>;
  }
  return row.map((cell, index) => {
    if (index === 0) {
      return (
        <th
          // ignoring this rule since our tables aren't dynamically rerendered
          // eslint-disable-next-line
          key={`row${rowIndex}-cell${index}`}
          className={cell ? 'row-header' : 'row-header empty'}
          scope="row"
        >
          {cell}
        </th>
      );
    }
    return (
      <td
        // ignoring this rule since our tables aren't dynamically rerendered
        // eslint-disable-next-line
        key={`row${rowIndex}-cell${index}`}
        className={!row[0] && !cell ? 'cell empty' : 'cell'}
      >
        {cell}
      </td>
    );
  });
}

export default function generateTable(specsArray) {
  return (
    <table>
      <caption>SPECIFICATIONS</caption>
      <tbody>
        {specsArray.map((row) => (
          <tr key={`specs-row-${specsArray.indexOf(row)}`}>
            {determineData(row, specsArray.indexOf(row))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
