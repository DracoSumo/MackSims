(function () {
  var toggle = document.querySelector(".site-nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  var form = document.getElementById("beta-signup-form");
  if (!form) return;

  var statusEl = document.getElementById("beta-form-status");
  var submitBtn = form.querySelector('[type="submit"]');
  var thanksUrl = form.getAttribute("data-thanks") || "/beta/thanks/";

  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message || "";
    statusEl.classList.remove("is-success", "is-error");
    if (kind) statusEl.classList.add(kind);
  }

  function selectedApps() {
    return Array.prototype.slice
      .call(form.querySelectorAll('input[name="apps"]:checked'))
      .map(function (input) {
        return input.value;
      });
  }

  function buildMailto(payload) {
    var body = [
      "MackSims external beta signup",
      "",
      "Name: " + payload.name,
      "Email: " + payload.email,
      "Apps: " + (payload.apps || "(none selected)"),
      "Platform: " + (payload.platform || "(not provided)"),
      "Store account email: " + (payload.store_email || "(not provided)"),
      "",
      payload.message || "(no message)",
    ].join("\n");

    return (
      "mailto:feedback@macksims.com?subject=" +
      encodeURIComponent("MackSims external beta tester") +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  function encodeBody(payload) {
    var params = new URLSearchParams();
    params.set("form-name", "beta-signup");
    params.set("name", payload.name);
    params.set("email", payload.email);
    params.set("apps", payload.apps);
    params.set("platform", payload.platform);
    params.set("store_email", payload.store_email);
    params.set("message", payload.message);
    params.set("source", "macksims-public-beta");
    return params.toString();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var honeypot = form.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      window.location.href = thanksUrl;
      return;
    }

    var apps = selectedApps();
    var payload = {
      name: (form.elements.namedItem("name") && form.elements.namedItem("name").value || "").trim(),
      email: (form.elements.namedItem("email") && form.elements.namedItem("email").value || "").trim(),
      apps: apps.join(", "),
      platform: (form.elements.namedItem("platform") && form.elements.namedItem("platform").value || "").trim(),
      store_email: (form.elements.namedItem("store_email") && form.elements.namedItem("store_email").value || "").trim(),
      message: (form.elements.namedItem("message") && form.elements.namedItem("message").value || "").trim(),
    };

    if (!payload.name || !payload.email) {
      setStatus("Name and email are required.", "is-error");
      return;
    }

    if (!apps.length) {
      setStatus("Select at least one app to test.", "is-error");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    setStatus("Submitting your beta request…");

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encodeBody(payload),
    })
      .then(function (response) {
        if (response.ok || response.status === 302) {
          window.location.href = thanksUrl;
          return;
        }
        throw new Error("Form submission failed (" + response.status + ")");
      })
      .catch(function () {
        setStatus(
          "Could not reach the signup service. Opening your email app as a backup…",
          "is-error"
        );
        window.location.href = buildMailto(payload);
      })
      .finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
})();
