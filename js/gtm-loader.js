window.params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
window.gtmId = 'GTM-TBJ4BW4'; //GTM-XXXXXX

if (window.params && typeof window.params.gtmId != 'undefined' && window.params.gtmId && window.params.gtmId != 'null') {
  window.gtmId = window.params.gtmId;
  localStorage.setItem("gtmId", window.gtmId);
} else if (localStorage && localStorage.getItem("gtmId")) {
  window.gtmId = localStorage.getItem("gtmId");
}

// GTM SNIPPET
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer',window.gtmId);