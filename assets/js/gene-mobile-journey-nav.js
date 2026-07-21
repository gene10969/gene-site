(function(){
  "use strict";

  if(document.querySelector(".gene-journey-mobile-nav")) return;

  const LINE_URL="https://lin.ee/6bBKc67";
  const HOME_URL=location.hostname.endsWith("github.io") ? "index.html" : "/";
  const INDEX_HASH=function(hash){ return HOME_URL + hash; };
  const sourcePage=location.pathname.split("/").pop() || "index.html";

  const symptomGroups=[
    {title:"よく見られる不調",links:[
      ["めまい","dizziness.html"],["不眠","insomnia.html"],
      ["頭痛","headache.html"],["動悸","palpitations.html"],
      ["慢性疲労","fatigue.html"],["パニック症状","panic.html"],
      ["不安障害","anxiety-disorder.html"],["吐き気","nausea.html"]
    ]},
    {title:"自律神経に関わる不調",links:[
      ["自律神経失調症","autonomic.html"],["起立性調節障害","orthostatic-dysregulation.html"],
      ["息苦しさ","shortness-of-breath.html"],["喉の違和感","throat-discomfort.html"],
      ["PMS","pms.html"],["冷え性","coldness.html"]
    ]},
    {title:"胃腸・皮膚・その他",links:[
      ["過敏性腸症候群","ibs.html"],["慢性便秘","chronic-constipation.html"],
      ["胃の不快感","stomach-discomfort.html"],["アトピー・皮膚症状","atopic.html"],
      ["耳鳴り","tinnitus.html"]
    ]},
    {title:"痛み・身体の不調",links:[
      ["顎関節症","tmj.html"],["腱鞘炎","tenosynovitis.html"],
      ["足底筋膜炎","plantar-fasciitis.html"]
    ]}
  ];

  function track(eventName,parameters){
    if(typeof window.gtag!=="function") return;
    window.gtag("event",eventName,Object.assign({
      event_category:"index_journey",
      source_page:sourcePage
    },parameters||{}));
  }

  const backdrop=document.createElement("div");
  backdrop.className="gene-journey-drawer-backdrop";
  backdrop.hidden=true;

  const drawer=document.createElement("section");
  drawer.className="gene-journey-drawer";
  drawer.id="gene-journey-drawer";
  drawer.hidden=true;
  drawer.setAttribute("aria-modal","true");
  drawer.setAttribute("role","dialog");

  const nav=document.createElement("nav");
  nav.className="gene-journey-mobile-nav";
  nav.setAttribute("aria-label","スマホ下部固定メニュー");
  nav.innerHTML=
    '<a href="'+HOME_URL+'"><span aria-hidden="true">⌂</span><small>ホーム</small></a>'+
    '<button type="button" data-drawer-view="symptoms" aria-controls="gene-journey-drawer" aria-expanded="false"><span aria-hidden="true">＋</span><small>お悩み</small></button>'+
    '<a href="menu.html"><span aria-hidden="true">◇</span><small>施術料金</small></a>'+
    '<button type="button" data-drawer-view="other" aria-controls="gene-journey-drawer" aria-expanded="false"><span aria-hidden="true">•••</span><small>その他</small></button>'+
    '<a href="'+LINE_URL+'" class="gene-mobile-line" target="_blank" rel="noopener"><span aria-hidden="true">↗</span><small>LINE</small></a>';

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);
  document.body.appendChild(nav);

  const symptomLinks=symptomGroups.map(function(group){
    const links=group.links.map(function(item){
      return '<a href="'+item[1]+'">'+item[0]+'</a>';
    }).join("");
    return '<section class="gene-drawer-symptom-group"><h3>'+group.title+'</h3><div class="gene-drawer-symptom-links">'+links+'</div></section>';
  }).join("");

  const views={
    symptoms:
      '<div class="gene-drawer-heading"><div><h2>症状から探す</h2></div><button type="button" class="gene-drawer-close" aria-label="閉じる">×</button></div>'+
      '<div class="gene-drawer-symptom-list">'+symptomLinks+'</div>'+
      '<a href="symptoms.html" class="gene-drawer-all-link">症状別ページをすべて見る</a>',
    other:
      '<div class="gene-drawer-heading"><div><h2>その他のご案内</h2></div><button type="button" class="gene-drawer-close" aria-label="閉じる">×</button></div>'+
      '<div class="gene-drawer-other-list">'+
      '<a href="'+INDEX_HASH('#gene-first-time')+'">初めての方へ<span>›</span></a>'+
      '<a href="check.html?from='+encodeURIComponent(sourcePage)+'">15問の簡易チェック<span>›</span></a>'+
      '<a href="voice.html">院内・改善写真<span>›</span></a>'+
      '<a href="faq.html">よくある質問<span>›</span></a>'+
      '<a href="access.html">アクセス<span>›</span></a></div>'
  };

  let lastTrigger=null;

  function closeDrawer(restoreFocus){
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    document.body.classList.remove("gene-drawer-open");
    nav.querySelectorAll('button[aria-expanded]').forEach(function(button){
      button.setAttribute("aria-expanded","false");
    });
    window.setTimeout(function(){
      drawer.hidden=true;
      backdrop.hidden=true;
    },240);
    if(restoreFocus!==false && lastTrigger) lastTrigger.focus({preventScroll:true});
  }

  function openDrawer(view,trigger){
    lastTrigger=trigger;
    drawer.innerHTML=views[view];
    drawer.hidden=false;
    backdrop.hidden=false;
    window.requestAnimationFrame(function(){
      drawer.classList.add("is-open");
      backdrop.classList.add("is-open");
    });
    document.body.classList.add("gene-drawer-open");
    nav.querySelectorAll('button[aria-expanded]').forEach(function(button){
      button.setAttribute("aria-expanded",button===trigger ? "true" : "false");
    });
    const close=drawer.querySelector(".gene-drawer-close");
    if(close) close.addEventListener("click",closeDrawer);
    drawer.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click",function(event){
        const href=link.getAttribute("href");
        track("mobile_drawer_link_click",{
          drawer_view:view,
          link_text:String(link.textContent||"").replace(/\s+/g," ").trim(),
          link_url:link.getAttribute("href")
        });
        if(!href || link.target==="_blank") {
          closeDrawer(false);
          return;
        }
        event.preventDefault();
        const destination=link.href;
        closeDrawer(false);
        window.setTimeout(function(){window.location.assign(destination);},30);
      });
    });
    track("mobile_drawer_open",{drawer_view:view});
    if(close) close.focus({preventScroll:true});
  }

  nav.querySelectorAll("button[data-drawer-view]").forEach(function(button){
    button.addEventListener("click",function(){
      const view=button.dataset.drawerView;
      if(!drawer.hidden && button.getAttribute("aria-expanded")==="true") closeDrawer();
      else openDrawer(view,button);
    });
  });

  nav.querySelectorAll("a").forEach(function(link){
    link.addEventListener("click",function(){
      track("journey_mobile_nav_click",{
        link_text:String(link.textContent||"").replace(/\s+/g," ").trim(),
        link_url:link.getAttribute("href")
      });
    });
  });

  backdrop.addEventListener("click",closeDrawer);
  document.addEventListener("keydown",function(event){
    if(event.key==="Escape" && !drawer.hidden) closeDrawer();
  });

  document.addEventListener("click",function(event){
    const target=event.target instanceof Element ? event.target : null;
    const link=target ? target.closest('a[href^="check.html"]') : null;
    if(!link || link.closest(".gene-journey-drawer") || link.target==="_blank" || event.defaultPrevented) return;
    event.preventDefault();
    window.location.assign(link.href);
  },true);
})();
