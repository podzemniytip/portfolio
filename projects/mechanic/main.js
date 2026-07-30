(function () {
  var filters = document.querySelectorAll(".filter");
  var rows = document.querySelectorAll(".table__row[data-cat]");

  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cat = btn.getAttribute("data-filter");
      filters.forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
      rows.forEach(function (row) {
        var rowCat = row.getAttribute("data-cat");
        var show = cat === "all" || rowCat === cat;
        row.classList.toggle("is-hidden", !show);
      });
    });
  });
})();
