(function(){
  "use strict";

  const LINE_URL="https://lin.ee/6bBKc67";
  const pageToken=location.pathname.split("/").filter(Boolean).pop() || "index.html";
  const sourcePage=pageToken.includes(".") ? pageToken : pageToken+".html";
  const filePreview=location.protocol === "file:";
  const githubPages=location.hostname.endsWith("github.io");
  const HOME_URL=(filePreview || githubPages) ? "index.html" : "/";
  const CHECK_URL="check.html?from="+encodeURIComponent(sourcePage);

  function track(eventName,parameters){
    if(typeof window.gtag !== "function") return;
    window.gtag("event",eventName,Object.assign({
      event_category:"global_navigation",
      source_page:sourcePage
    },parameters || {}));
  }

  function setupCheckLinks(){
    if(document.documentElement.dataset.geneCheckLinksReady === "true") return;
    document.documentElement.dataset.geneCheckLinksReady="true";

    document.addEventListener("click",function(event){
      if(event.defaultPrevented || event.button !== 0) return;
      if(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target=event.target;
      if(!(target instanceof Element)) return;
      const link=target.closest('a[href*="check.html"]');
      if(!link) return;

      const rawHref=link.getAttribute("href");
      if(!rawHref) return;

      const destination=new URL(rawHref,document.baseURI);
      event.preventDefault();

      track("quick_check_entry_click",{
        link_text:String(link.textContent || "").replace(/\s+/g," ").trim(),
        link_url:destination.href
      });

      window.location.assign(destination.href);
    },true);
  }

  function isAccessLink(link){
    if(!(link instanceof HTMLAnchorElement)) return false;
    const rawHref=link.getAttribute("href") || "";
    try{
      const destination=new URL(rawHref,document.baseURI);
      return /(?:^|\/)access(?:\.html)?$/.test(destination.pathname);
    }catch(error){
      return false;
    }
  }

  function replaceAccessLabel(element){
    if(!(element instanceof Element)) return;
    const label=String(element.textContent || "").replace(/\s+/g," ").trim();

    if(label === "アクセス"){
      element.textContent="アクセス・営業時間";
    }else if(label === "アクセスページを見る"){
      element.textContent="アクセス・営業時間を見る";
    }
  }

  function normalizeAccessLink(link){
    if(!isAccessLink(link)) return;

    replaceAccessLabel(link);
    link.querySelectorAll(".nav-text, small, span").forEach(function(labelElement){
      replaceAccessLabel(labelElement);
    });

    const ariaLabel=link.getAttribute("aria-label");
    if(ariaLabel === "アクセス"){
      link.setAttribute("aria-label","アクセス・営業時間");
    }
  }

  function normalizeAccessLinks(root){
    if(root instanceof HTMLAnchorElement) normalizeAccessLink(root);
    if(!(root instanceof Element || root instanceof Document)) return;
    root.querySelectorAll('a[href]').forEach(normalizeAccessLink);
  }

  function observeAccessLinks(){
    normalizeAccessLinks(document);

    const observer=new MutationObserver(function(records){
      records.forEach(function(record){
        record.addedNodes.forEach(function(node){
          if(node instanceof Element) normalizeAccessLinks(node);
        });
      });
    });

    observer.observe(document.body,{
      childList:true,
      subtree:true
    });
  }

  function updateAccessDoorGuide(){
    if(sourcePage !== "access.html") return;

    const image=document.querySelector('img[src="assets/img/gene-door-guide.webp"]');
    if(!image) return;

    image.src="assets/img/gene-door-guide-20260723.svg?v=20260723-4";
    image.alt="703号室geneの玄関とドア側のインターホン案内";
    image.width=480;
    image.height=640;
    image.decoding="async";

    const figure=image.closest("figure");
    const caption=figure ? figure.querySelector("figcaption") : null;
    if(caption){
      caption.innerHTML="<strong>4. 703号室</strong><br>到着されましたら<br>ドア側のインターホンを押してください。";
    }
  }

  function createHeader(){
    if(document.querySelector(".gene-global-header")) return;

    const header=document.createElement("header");
    header.className="gene-global-header";
    header.innerHTML=
      '<a class="gene-global-header__brand" href="'+HOME_URL+'" aria-label="大阪 自律神経専門整体院 gene ホーム">'+
        '<span class="gene-global-header__clinic-name">大阪 自律神経専門整体院 gene</span>'+
      '</a>'+
      '<nav class="gene-global-header__nav" aria-label="PC上部固定メニュー">'+
        '<a href="'+HOME_URL+'" data-gene-page="home">ホーム</a>'+
        '<a href="symptoms.html" data-gene-page="symptoms">症状別</a>'+
        '<a href="menu.html" data-gene-page="menu">施術内容・料金</a>'+
        '<a href="'+CHECK_URL+'" class="gene-global-header__check" data-gene-page="check">15問チェック</a>'+
        '<a href="voice.html" data-gene-page="voice">院内・改善写真</a>'+
        '<a href="access.html" data-gene-page="access">アクセス・営業時間</a>'+
        '<a href="'+LINE_URL+'" class="gene-global-header__line" target="_blank" rel="noopener">空き状況</a>'+
      '</nav>';

    document.body.prepend(header);

    const currentToken=location.pathname.split("/").filter(Boolean).pop() || "index.html";
    const currentFile=currentToken.includes(".") ? currentToken : currentToken+".html";
    const activeMap={
      "index.html":"home",
      "symptoms.html":"symptoms",
      "menu.html":"menu",
      "check.html":"check",
      "voice.html":"voice",
      "case1.html":"voice",
      "case2.html":"voice",
      "case3.html":"voice",
      "access.html":"access"
    };
    const activePage=activeMap[currentFile];
    if(activePage){
      const activeLink=header.querySelector('[data-gene-page="'+activePage+'"]');
      if(activeLink) activeLink.setAttribute("aria-current","page");
    }

    header.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click",function(){
        track("global_header_click",{
          link_text:String(link.textContent || "").replace(/\s+/g," ").trim(),
          link_url:link.getAttribute("href")
        });
      });
    });

    const showHeader=function(){
      window.requestAnimationFrame(function(){
        header.classList.add("is-ready");
      });
    };

    if(sourcePage==="index.html" &&
       !document.documentElement.classList.contains("gene-index-page-revealed")){
      document.addEventListener("gene:index-page-revealed",showHeader,{once:true});
    }else{
      showHeader();
    }
  }

  function init(){
    setupCheckLinks();
    updateAccessDoorGuide();
    createHeader();
    observeAccessLinks();
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded",init,{once:true});
  }else{
    init();
  }
})();
