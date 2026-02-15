const buttons = document.querySelectorAll("[data-command]");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const command = btn.getAttribute("data-command");
    navigator.clipboard
      .writeText(command)
      .then(() => {
        btn.textContent = "Command copied";
        setTimeout(() => {
          btn.textContent = command.startsWith("npm run approve")
            ? "Approve → Publish"
            : "Decline / archive";
        }, 1500);
      })
      .catch(() => {
        alert(command);
      });
  });
});
