interface BaseFormProps {
}

export default function BaseForm({}: BaseFormProps) {
  return (
    <form method="GET" action="/" target="_self">
      <label htmlFor="text">Text:</label> <br />
      <input type="text" id="text" name="text" /> <br />
      <label htmlFor="password">Password:</label> <br />
      <input type="password" id="password" name="password" /> <br />
      <label htmlFor="cars">Choose a car:</label> <br />
      <select id="cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
      </select>
    </form>
  );
}
