const ListErrors = ({ errors }) => {
  if (!errors) return null;

  return (
    <ul className="error-messages">
      {Object.entries(errors).map(([field, messages]) => (
        <li key={field}>
          {Array.isArray(messages)
            ? messages.map((msg, i) => (
                <span key={i}>
                  {field} {msg}
                  {i < messages.length - 1 && <br />}
                </span>
              ))
            : `${field} ${messages}`}
        </li>
      ))}
    </ul>
  );
};

export default ListErrors;
