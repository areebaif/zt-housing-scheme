export const formatCnic = (val: string) => {
  const trim = val.trim();
  const firstDash = trim.replace(/\B(?=(\d{8})+(?!\d))/, "-");
  if (firstDash.charAt(firstDash.length - 2) === "-") {
    return firstDash;
  } else {
    const result = firstDash
      .slice(0, firstDash.length - 1)
      .concat("-")
      .concat(firstDash.charAt(firstDash.length - 1));
    return result;
  }
};
