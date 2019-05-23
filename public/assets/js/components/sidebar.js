Vue.component('sidebar', {
  template: //html
  `
  <div>
  <div class="area"></div><nav class="main-menu">
          <ul>
              <li>
                  <a href="/dashboard">
                      <i class="fa fa-home fa-2x"></i>
                      <span class="nav-text">
                          Dashboard
                      </span>
                  </a>

              </li>
              <li>
                  <a href="/comandesvenda">
                      <i class="fa fa-bar-chart-o fa-2x"></i>
                      <span class="nav-text">
                          Comandes de Venda
                      </span>
                  </a>
              </li>

              <li class="has-subnav" v-if="dadesusuaribd.grup === 'informatic'">
                  <a href="/logs">
                     <i class="fa fa-list fa-2x"></i>
                      <span class="nav-text">
                          Logs
                      </span>
                  </a>

              </li>
              <li class="has-subnav">
                  <a href="/rss">
                     <i class="fa fa-rss fa-2x"></i>
                      <span class="nav-text">
                          RSS
                      </span>
                  </a>

              </li>


              <li>
                  <a href="/informacio">
                     <i class="fa fa-info fa-2x"></i>
                      <span class="nav-text">
                          Informació
                      </span>
                  </a>
              </li>
          </ul>

      </nav>
  </div>
  `,
  props: ['dadesusuaribd']
});
