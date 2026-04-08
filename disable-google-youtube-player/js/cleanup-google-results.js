const hideme = {
  '[role="listitem"]': ["AI Mode", "Short videos", "Forums"],
  "#rso > .MjjYud": ["People also ask"],
};

Object.entries(hideme).forEach(([qs, hideMatching]) => {
  document.querySelectorAll(qs).forEach((item) => {
    const label = item.innerText;

    for (const tab of hideMatching) {
      if (label.indexOf(tab) !== -1) {
        item.setAttribute("dgyp-target", "");
        break;
      }
    }
  });
});

const toggle = document.createElement("input");
toggle.id = "dgypShown";
toggle.type = "checkbox";
toggle.checked = true;
toggle.title = "Hide crap";

toggle.addEventListener("change", (e) => {
  if (toggle.checked) {
    document.body.removeAttribute("dgyp-shown");
  } else {
    document.body.setAttribute("dgyp-shown", "");
  }
});
document.querySelector("#searchform header").append(toggle);
