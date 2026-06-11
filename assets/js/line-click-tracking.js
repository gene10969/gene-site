(function(){
  if (window.__geneLineClickTrackingReady) return;
  window.__geneLineClickTrackingReady = true;

  function isInternalUser(){
    try{
      return localStorage.getItem("internalUser") === "true";
    }catch(e){
      return false;
    }
  }

  function isLineLink(url){
    try{
      var u = new URL(url, location.href);
      return (
        u.hostname === "lin.ee" ||
        u.hostname === "line.me" ||
        u.hostname.endsWith(".line.me")
      );
    }catch(e){
      return false;
    }
  }

  function normalizeText(text){
    return (text || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 80);
  }

  function getCurrentPageName(){
    var path = location.pathname || "/";
    if(path === "/" || path.endsWith("/")) return "index";
    return path.split("/").pop().replace(".html", "") || "index";
  }

  function detectLineArea(link){
    if(link.dataset && link.dataset.lineArea){
      return link.dataset.lineArea;
    }

    if(link.classList.contains("reserve-btn-sub")){
      return "fixed_reserve_button";
    }

    if(link.classList.contains("line-nav")){
      return "mobile_bottom_nav";
    }

    if(link.closest(".case-detail-links")){
      return "case_top_link";
    }

    if(link.closest(".case-cta")){
      return "case_cta";
    }

    if(link.closest(".hamburger-menu")){
      return "hamburger_menu";
    }

    if(link.closest(".footer-line") || link.closest("footer")){
      return "footer";
    }

    if(link.closest(".cta") || link.closest(".line-cta") || link.closest(".reserve-section")){
      return "page_cta";
    }

    var page = getCurrentPageName();

    if(page.indexOf("case") === 0){
      return "case_page_line_link";
    }

    if(page === "menu"){
      return "menu_page_line_link";
    }

    if(page === "access"){
      return "access_page_line_link";
    }

    if(page === "atopic"){
      return "atopic_page_line_link";
    }

    if(page === "check"){
      return "quick_check_line_link";
    }

    return "unknown_line_link";
  }

  function sendLineClickEvent(link){
    if(isInternalUser()) return;
    if(typeof gtag !== "function") return;

    var href = link.href || link.getAttribute("href") || "";
    if(!isLineLink(href)) return;

    var lineArea = detectLineArea(link);
    var pageName = getCurrentPageName();
    var linkText = normalizeText(link.innerText || link.textContent || link.getAttribute("aria-label"));

    gtag("event", "line_click", {
      line_area: lineArea,
      page_name: pageName,
      page_path: location.pathname,
      link_text: linkText,
      link_url: href,
      transport_type: "beacon"
    });
  }

  document.addEventListener("click", function(e){
    var target = e.target;
    if(!target || !target.closest) return;

    var link = target.closest("a[href]");
    if(!link) return;

    sendLineClickEvent(link);
  }, true);
})();
