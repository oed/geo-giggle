
export default function TagFilter({ tags, setTags }) {
  console.log('filter', tags)

  function onChange(event) {
    console.log(event.target.name, event.target.checked)
    let newTags = { ...tags };
    newTags[event.target.name] = event.target.checked;
    console.log(setTags, newTags)
    setTags(newTags)
    console.log(tags)
  }
  return (
    <>
      <input type="checkbox" name="danger" checked={tags["danger"]} onChange={onChange} />
      <label>Danger</label>
      <br />
      <input type="checkbox" name="interest" checked={tags["interest"]} onChange={onChange} />
      <label>Interest</label>
      <br />
      <input type="checkbox" name="food" checked={tags["food"]} onChange={onChange} />
      <label>Good Food</label>
      <br />
    </>
  );
}


