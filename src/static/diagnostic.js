/* The AI×HI Diagnostic — client-side only.
   Privacy invariants (spec 2026-06-11, R2): answers live in in-memory state only.
   Nothing is written to localStorage, cookies, or the URL; nothing is transmitted.
   The only telemetry is cookieless Umami funnel events carrying, at most, the
   quadrant id — never answer content. User-written text reaches the DOM solely
   via textContent (no innerHTML), so it is inert and stays on the page. */
(function () {
  "use strict";

  var dataEl = document.getElementById("diagnostic-data");
  var root = document.getElementById("diagnostic-app");
  if (!dataEl || !root) return;

  var D;
  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }

  var QS = D.questions;
  var answers = {}; // key -> { score: 0..3 } | { text: "..." } — in memory only
  var step = -1;    // -1 intro, 0..QS.length-1 questions, QS.length result

  function track(name, payload) {
    try { if (window.umami && typeof window.umami.track === "function") window.umami.track(name, payload); } catch (e) {}
  }

  function h(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function clear() { while (root.firstChild) root.removeChild(root.firstChild); }

  /* ── Intro ──────────────────────────────────────────────── */

  function renderIntro() {
    clear();
    var card = h("div", "diagnostic-card");
    card.appendChild(h("p", "diagnostic-count", QS.length + " questions · about 2 minutes"));
    var btn = h("button", "diagnostic-btn", "Start the self-check");
    btn.addEventListener("click", function () {
      track("diagnostic_start");
      step = 0;
      renderQuestion();
    });
    card.appendChild(btn);
    root.appendChild(card);
  }

  /* ── Questions ──────────────────────────────────────────── */

  function renderQuestion() {
    clear();
    var q = QS[step];
    var prev = answers[q.key];
    var card = h("div", "diagnostic-card");

    card.appendChild(h("p", "diagnostic-progress", "Question " + (step + 1) + " of " + QS.length + " — " + q.label));
    card.appendChild(h("p", "diagnostic-prompt", q.prompt));

    var list = h("div", "diagnostic-options");
    q.options.forEach(function (opt, i) {
      var b = h("button", "diagnostic-option" + (prev && prev.score === i ? " selected" : ""), opt);
      b.addEventListener("click", function () {
        answers[q.key] = { score: i };
        advance();
      });
      list.appendChild(b);
    });
    card.appendChild(list);

    // Own answer — the reflective option. Unscored, never leaves the page.
    var ownWrap = h("div", "diagnostic-own");
    var ownToggle = h("button", "diagnostic-own-toggle", "✎ None of these — I'd put it differently");
    var ownForm = h("div", "diagnostic-own-form");
    ownForm.hidden = !(prev && prev.text != null);
    var ta = document.createElement("textarea");
    ta.className = "diagnostic-own-text";
    ta.rows = 3;
    ta.placeholder = "Say it the way it actually is for you. This stays on this page — it is never sent anywhere.";
    if (prev && prev.text != null) ta.value = prev.text;
    var ownSubmit = h("button", "diagnostic-btn diagnostic-own-submit", "Use my answer");
    ownToggle.addEventListener("click", function () {
      ownForm.hidden = !ownForm.hidden;
      if (!ownForm.hidden) ta.focus();
    });
    ownSubmit.addEventListener("click", function () {
      var v = ta.value.trim();
      if (!v) { ta.focus(); return; }
      answers[q.key] = { text: v };
      advance();
    });
    ownForm.appendChild(ta);
    ownForm.appendChild(ownSubmit);
    ownWrap.appendChild(ownToggle);
    ownWrap.appendChild(ownForm);
    card.appendChild(ownWrap);

    var navRow = h("p", "diagnostic-nav");
    if (step > 0) {
      var back = h("a", "diagnostic-back", "← Back");
      back.href = "#";
      back.addEventListener("click", function (ev) { ev.preventDefault(); step--; renderQuestion(); });
      navRow.appendChild(back);
    }
    card.appendChild(navRow);
    root.appendChild(card);
    card.scrollIntoView({ block: "nearest" });
  }

  function advance() {
    if (step < QS.length - 1) { step++; renderQuestion(); }
    else { renderResult(); }
  }

  /* ── Scoring ────────────────────────────────────────────── */

  function axisScore(axis) {
    var scores = QS.filter(function (q) { return q.axis === axis; })
      .map(function (q) { return answers[q.key]; })
      .filter(function (a) { return a && typeof a.score === "number"; })
      .map(function (a) { return a.score; });
    if (!scores.length) return null;
    return scores.reduce(function (s, v) { return s + v; }, 0) / scores.length;
  }

  function depthNuance(s) {
    if (s < 0.75) return "firmly on the tool-use side — AI executes, your way of working is intact";
    if (s < 1.5) return "leaning tool-use — AI helps, but the thinking is still recognizably yours alone";
    if (s < 2.25) return "leaning structural — AI has started changing how you think and work";
    return "deep in structural change — the relationship has reshaped how you think, decide, remember";
  }

  function intentNuance(s) {
    if (s < 0.75) return "the change is mostly happening to you — usage evolves on its own";
    if (s < 1.5) return "drifting more than steering — instincts, not decisions";
    if (s < 2.25) return "mostly steering — you make conscious calls about the relationship";
    return "designing — you treat the relationship itself as something you build and revise";
  }

  /* ── Result ─────────────────────────────────────────────── */

  function ownAnswers() {
    return QS.map(function (q) {
      var a = answers[q.key];
      return a && a.text != null ? { label: q.label, prompt: q.prompt, text: a.text } : null;
    }).filter(Boolean);
  }

  function renderResult() {
    clear();
    var depth = axisScore("depth");
    var intent = axisScore("intent");
    var own = ownAnswers();
    var card = h("div", "diagnostic-card diagnostic-result");
    var quad = null;

    if (depth === null || intent === null) {
      track("diagnostic_complete", { quadrant: "unplotted" });
      card.appendChild(h("p", "diagnostic-progress", "Your result"));
      card.appendChild(h("h2", "diagnostic-result-name", D.unplotted.name));
      card.appendChild(h("p", "diagnostic-reading", D.unplotted.reading));
    } else {
      var key = (depth >= 1.5 ? "structural" : "tooluse") + "-" + (intent >= 1.5 ? "designed" : "drifting");
      quad = D.quadrants[key];
      track("diagnostic_complete", { quadrant: quad.id });

      // Mini 2×2 matrix with the reader's dot.
      var fig = h("div", "diagnostic-matrix");
      fig.setAttribute("role", "img");
      fig.setAttribute("aria-label", "Your position on the AI×HI matrix: " + quad.name);
      ["structural-drifting", "structural-designed", "tooluse-drifting", "tooluse-designed"].forEach(function (k) {
        var cell = h("div", "matrix-cell" + (D.quadrants[k].id === quad.id ? " active" : ""), D.quadrants[k].name);
        fig.appendChild(cell);
      });
      var dot = h("div", "matrix-dot");
      dot.style.left = "calc(" + (intent / 3) * 100 + "% - 6px)";
      dot.style.top = "calc(" + (1 - depth / 3) * 100 + "% - 6px)";
      fig.appendChild(dot);
      var axisX = h("div", "matrix-axis-x", "drifting → designed");
      var axisY = h("div", "matrix-axis-y", "tool-use → structural");
      var figWrap = h("div", "diagnostic-matrix-wrap");
      figWrap.appendChild(fig);
      figWrap.appendChild(axisX);
      figWrap.appendChild(axisY);
      card.appendChild(figWrap);

      card.appendChild(h("p", "diagnostic-progress", "Your position"));
      card.appendChild(h("h2", "diagnostic-result-name", quad.name));
      card.appendChild(h("p", "diagnostic-tagline", quad.tagline));
      card.appendChild(h("p", "diagnostic-reading", quad.reading));

      var nuance = h("ul", "diagnostic-nuance");
      nuance.appendChild(h("li", null, "Depth: " + depthNuance(depth) + "."));
      nuance.appendChild(h("li", null, "Intent: " + intentNuance(intent) + "."));
      card.appendChild(nuance);
    }

    if (own.length) {
      card.appendChild(h("p", "section-label", "In your own words"));
      var ownList = h("div", "diagnostic-ownwords");
      own.forEach(function (o) {
        var blk = h("blockquote", "diagnostic-ownword");
        blk.appendChild(h("p", "diagnostic-ownword-label", o.label));
        blk.appendChild(h("p", null, o.text));
        ownList.appendChild(blk);
      });
      card.appendChild(ownList);
      card.appendChild(h("p", "diagnostic-privacy", "These stayed on this page. Nothing you wrote was stored or sent."));
    }

    var essays = quad ? quad.essays : [
      { num: "001", slug: "001-you-are-not-using-ai", title: "You Are Not Using AI. You Are in a Relationship With It.", why: "where the whole journey begins" },
      { num: "005", slug: "005-the-partner-who-cannot-leave", title: "The Partner Who Cannot Leave", why: "the asymmetry at the heart of it" },
    ];
    card.appendChild(h("p", "section-label", "Read next, from where you stand"));
    essays.forEach(function (e) {
      var item = h("div", "related-item");
      var hd = h("h3");
      var a = h("a", null, e.title);
      a.href = "/posts/" + e.slug + "/";
      a.addEventListener("click", function () { track("diagnostic_essay_click", { essay: e.num }); });
      hd.appendChild(a);
      item.appendChild(hd);
      item.appendChild(h("p", "post-excerpt", "Why this one: " + e.why + "."));
      card.appendChild(item);
    });

    var cta = h("a", "diagnostic-btn diagnostic-cta", "Keep thinking with us — new essays every other Thursday →");
    cta.href = "#subscribe";
    cta.addEventListener("click", function () { track("diagnostic_subscribe_click"); });
    card.appendChild(cta);

    var tools = h("p", "diagnostic-tools");
    var copyBtn = h("button", "diagnostic-link-btn", "Copy my result");
    copyBtn.addEventListener("click", function () {
      var lines = ["The AI×HI Self-Check — my result", ""];
      if (quad) {
        lines.push("Position: " + quad.name + " — " + quad.tagline);
        lines.push(quad.reading, "");
        lines.push("Depth: " + depthNuance(depth) + ".");
        lines.push("Intent: " + intentNuance(intent) + ".", "");
      } else {
        lines.push(D.unplotted.name, "");
      }
      if (own.length) {
        lines.push("In my own words:");
        own.forEach(function (o) { lines.push("- " + o.label + ": " + o.text); });
        lines.push("");
      }
      lines.push("Taken at https://symbiotic-mind.com/diagnostic/");
      navigator.clipboard.writeText(lines.join("\n")).then(function () {
        copyBtn.textContent = "Copied ✓";
        setTimeout(function () { copyBtn.textContent = "Copy my result"; }, 2000);
      });
    });
    var retake = h("button", "diagnostic-link-btn", "Retake");
    retake.addEventListener("click", function () { answers = {}; step = -1; renderIntro(); });
    tools.appendChild(copyBtn);
    tools.appendChild(retake);
    card.appendChild(tools);

    root.appendChild(card);
    card.scrollIntoView({ block: "nearest" });
  }

  renderIntro();
})();
