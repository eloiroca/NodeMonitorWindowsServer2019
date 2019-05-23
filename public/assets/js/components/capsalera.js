Vue.component('capsalera', {
  template: //html
  `
  <div class='capsalera'>
    <div class='col-md-4 apartat_header_ubuntu'><div class='dadesUbuntuConectat nom'><a class='nom' href='/dashboard'><img height="43px" src="/assets/img/imatges_web/icono-ubuntuLogo.png"/> {{dadessoftware.nomSO}}</a></div></div>
    <div class='col-md-4 apartat_header_rol'><div class='dadesRolConectat nom'> <img height="50px" src="/assets/img/imatges_web/icono-conectat.png"/> {{dadesusuaribd.grup}}</div></div>
    <div class='col-md-4 apartat_header'>
      <div class='dropdown dropdown-toggle show dadesUsuariConectat' data-toggle='dropdown'>
        <img height="50px" :src="'/assets/img/imatges_web/'+dadesusuaribd.imatge"/>
        <p class='nom'>{{dadesusuaribd.uid}}<i class="fa fa-caret-down flexeta "></i></p>
      </div>
        <ul class="dropdown-menu">
          <li><a href="/editar_usuari">Editar Usuari</a></li>
          <li><a href="/logout">Sortir</a></li>
        </ul>
      </div>
  </div>
  `,
  props: ['dadesusuaribd', 'dadessoftware']
});
