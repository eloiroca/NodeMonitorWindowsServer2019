new Vue({
  el: '#app',
  data: {
      dadesUsuariBD: [],
      dadesPermis: false,
      dadesSOFTWARE: [],
      dadesCOMANDA:[],
      dadesPRODUCTES:[]
  },
  created: function(){
      this.obtenirDadesUsuariBD();
      this.obtenirDadesSOFTWARE();
      this.obtenirCOMANDES();
  },
  methods:{
      obtenirDadesUsuariBD(){
          this.$http.get('/demanarDadesBD').then(function(response){
              try {
                    this.dadesUsuariBD = JSON.parse(response.data);
              } catch(e) {
                  Swal.fire({
                    title: "ALERTA",
                    text: "No has iniciat sessio per accedir!!!",
                    confirmButtonText: "Acceptar",
                  });
              }
          });
      },
      obtenirDadesSOFTWARE(){
        this.$http.get('/demanarDadesSOFTWARE').then(function(response){
            this.dadesSOFTWARE = JSON.parse(response.data);
        });
      },
      obtenirCOMANDES(){
          this.$http.get('/demanarCOMANDES').then(function(response){
              this.dadesCOMANDA = JSON.parse(response.data);
              console.log(this.dadesCOMANDA);
          });
      },
      demanarComandesServides(){
        this.$http.get('/demanarComandesServides').then(function(response){
            this.dadesCOMANDA = JSON.parse(response.data);
        });
      },
      servirComanda(comanda){
        Swal.fire({
                title: 'Estàs segur que vols servir la comanda?',
                text: "S'enviarà la comanda al repartidor",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28B463',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancel·lar',
                confirmButtonText: 'Si, servir!'
              }).then((result) => {
                if (result.value) {
                    axios.post('/servirCOMANDA', {dades: {"numComanda":comanda,"nomUsuari":this.dadesUsuariBD.uid}}).then((response) => {
                        if (response.statusText === 'OK'){
                            alertify.success("Comanda Servida!");
                            setTimeout(recargarPagina,1000);
                            function recargarPagina(){
                                location.reload();
                            }
                        }
                    }, (response) => {
                        console.log(response);
                    });
                }
              })
      },
      mostrarComanda(comanda){

        axios.post('/mostrarCOMANDA', {dades: {"numComanda":comanda,"nomUsuari":this.dadesUsuariBD.uid}}).then((response) => {
              var dadesPRODUCTES = response.data;
              var llistaProductes = "<ol>";
              for (var i = 0; i < dadesPRODUCTES.length; i++) {
                llistaProductes+="<li> CODI PRODUCTE:<b>"+dadesPRODUCTES[i].id+"</b> NOM PRODUCTE: <b>"+dadesPRODUCTES[i].nom+ "</b> PREU PRODUCTE: <b>"+dadesPRODUCTES[i].preu+" €</b>";
              }
              llistaProductes+="</ol>";

              Swal.fire({
                title: "Productes de la Comanda "+comanda,
                html: llistaProductes,
                confirmButtonText: "Acceptar",
                width: "900px",
              });
        }, (response) => {
            console.log(response);
        });
      },
      eliminarComanda(comanda){
        Swal.fire({
                title: 'Estàs segur que vols eliminar la comanda?',
                text: "S'eliminara la comanda per sempre",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28B463',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancel·lar',
                confirmButtonText: 'Si, eliminar!'
              }).then((result) => {
                if (result.value) {
                    axios.post('/eliminarCOMANDA', {dades: {"numComanda":comanda,"nomUsuari":this.dadesUsuariBD.uid}}).then((response) => {
                        if (response.statusText === 'OK'){
                            alertify.success("Comanda Eliminada!");
                            setTimeout(recargarPagina,1000);
                            function recargarPagina(){
                                location.reload();
                            }
                        }
                    }, (response) => {
                        console.log(response);
                    });
                }
              })
      }

    }
});


jQuery(function() {
    jQuery('.waveWrapper').css('height', '2000px');
});
