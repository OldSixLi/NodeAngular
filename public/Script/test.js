$("#selector").click(function() {
  if (this.checked) {
    $("input[type='checkbox'][name='names']").each(function() { this.checked = true; });
  } else {
    $("input[type='checkbox'][name='names']").each(function() { this.checked = false; });
  }
});