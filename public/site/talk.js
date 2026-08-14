document.querySelectorAll(".service-option input").forEach((input) => {
  input.addEventListener("change", () => {
    input.closest(".service-option").classList.toggle("is-selected", input.checked);
  });
});
