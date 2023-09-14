/*
=====================================================
 This file is part of ParsedClassics app
=====================================================
 Copyright (c) Eleutherius Joannides
=====================================================
*/

const ParsedClassicsNavigation = {
  createNavHtml: function (paneId) {
    const id = paneId;
    const navHtml = `
      <nav>
        <div>
          <ul id="main-menu-${paneId}" class="sm sm-simple">
            <li ><a class="sm-menu-button" title="Menu"><img class="sm-menu-button-img" src="img/interverb.svg" /></a>
              <ul class="sm-menu-content" >
                <li>
                  <div class="sm__layout-buttons"> 
                  </div>
                </li>
                <li class="sm__pane-selects-container" id="pane-selects-container-${paneId}">
                </li>
                <!--<li>
                  <a class="sm__layout-link sm__layout-link--cursor-default"> 
                  Options
                  </a>
                </li>-->
                <li>
                  <a class="sm__layout-link" href="site/index.html" target="_blank"> 
                  PARSED<span class="sm-interverb-symbol">⋮</span>CLASSICS
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    `;
    return [navHtml, id];
  },

  createNav: function (paneTopPartEl, paneId) {
    const [navHtml, id] = ParsedClassicsNavigation.createNavHtml(paneId);
    const navEl = $(navHtml);
    paneTopPartEl.prepend(navEl);
    
    navEl.find(`#main-menu-${id}`).smartmenus({
      subMenusSubOffsetX: 1,
      subMenusSubOffsetY: -8,
      showOnClick: true,
      hideOnClick: true,
      noMouseOver: true,
      subIndicators: false,
      subMenusMinWidth: '20em',
    });
  },
}; // End of ParsedClassicsNavigation script
