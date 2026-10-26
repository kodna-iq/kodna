/* Burji pages: language choice shared with the game ("stack-lang") and kodna.org ("kodna_lang") */
(function () {
  var LANGS = [['ar','العربية'],['en','English'],['ku','کوردی'],['tr','Türkçe'],['fr','Français'],['es','Español'],['fa','فارسی'],['ur','اردو'],['id','Indonesia'],['pt','Português'],['zh','中文'],['ru','Русский']];
  var RTL = {ar: 1, ku: 1, fa: 1, ur: 1};
  var SITE = {ar: 1, en: 1, ku: 1, zh: 1, es: 1, ru: 1};
  function get(k){ try { return localStorage.getItem(k); } catch (e) { return null; } }
  function put(k, v){ try { localStorage.setItem(k, v); } catch (e) {} }
  function ok(l){ for (var i = 0; i < LANGS.length; i++) if (LANGS[i][0] === l) return true; return false; }
  function pick(){
    var q = null;
    try { q = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (ok(q)) return {l: q, keep: true};
    var s = get('stack-lang'); if (ok(s)) return {l: s};
    var k = get('kodna_lang'); if (ok(k)) return {l: k, keep: true};
    var n = (navigator.language || '').toLowerCase();
    if (n.indexOf('ckb') === 0 || n.indexOf('ku') === 0) return {l: 'ku'};
    n = n.slice(0, 2);
    if (ok(n)) return {l: n};
    return {l: 'en'};
  }
  function remember(l){ put('stack-lang', l); if (SITE[l]) put('kodna_lang', l); }
  window.BurjiLang = {
    list: LANGS,
    init: function (apply) {
      var p = pick(), cur = p.l;
      if (p.keep) remember(cur);
      function set(l){
        cur = l;
        document.documentElement.lang = l;
        document.documentElement.dir = RTL[l] ? 'rtl' : 'ltr';
        apply(l, !!RTL[l]);
        var s = document.getElementById('langPick');
        if (s) s.value = l;
      }
      var sel = document.getElementById('langPick');
      if (sel) {
        for (var i = 0; i < LANGS.length; i++) {
          var o = document.createElement('option');
          o.value = LANGS[i][0]; o.textContent = LANGS[i][1]; o.lang = LANGS[i][0];
          sel.appendChild(o);
        }
        sel.addEventListener('change', function () { remember(sel.value); set(sel.value); });
      }
      set(cur);
    }
  };
})();
