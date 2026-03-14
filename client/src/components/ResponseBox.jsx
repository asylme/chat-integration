import React from "react";

function ResponseBox({ response, error, loading }) {
  const baseClassName =
    "min-h-[120px] whitespace-pre-wrap rounded-xl border border-[rgba(204,214,229,0.25)] bg-white p-3 text-black";

  if (loading) {
    return <section className={baseClassName}>Загрузка ответа...</section>;
  }

  if (error) {
    return (
      <section
        className={`${baseClassName} border-[rgba(255,126,126,0.55)] bg-[rgba(122,24,24,0.35)]`}
      >
        {error}
      </section>
    );
  }

  if (!response) {
    return <section className={baseClassName}>Ответ появится здесь</section>;
  }

  return <section className={baseClassName}>{response}</section>;
}

export default ResponseBox;
