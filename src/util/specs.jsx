function determineData(row) {
  if (!row[1]) {
    // second value in array will be null if it's a heading
    return <th colSpan="2">{row[0].toUpperCase()}</th>;
  }
  return (
    <>
      <th scope="row">{row[0]}</th>
      <td>{row[1]}</td>
    </>
  );
}

export default function generateTable(specsArray) {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="2">SPECIFICATIONS</th>
        </tr>
      </thead>
      <tbody>
        {specsArray.map((row) => (
          <tr key={`specs-row-${specsArray.indexOf(row)}`}>
            {determineData(row)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
