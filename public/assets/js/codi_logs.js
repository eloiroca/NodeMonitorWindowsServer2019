new Vue({
  el: '#app',
  data: {
      dadesUsuariBD: [],
      dadesSOFTWARE: [],
      dadesLOGS: []
  },
  created: function(){
      this.obtenirDadesUsuariBD();
      this.obtenirDadesSOFTWARE();
      this.obtenirDadesLogs();
  },
  methods:{
      obtenirDadesUsuariBD(){
          this.$http.get('/demanarDadesBD').then(function(response){
            try {
                  this.dadesUsuariBD = JSON.parse(response.data);
                  if (this.dadesUsuariBD.grup != 'informatic'){
                    Swal.fire({
                      title: "ALERTA",
                      text: "No tens permisos suficients per accedir!!!",
                      confirmButtonText: "Acceptar",
                    });
                  }
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
      obtenirDadesLogs(){
        this.$http.get('/demanarRegistresLog').then(function(response){
            this.dadesLOGS = JSON.parse(response.data);
        });
      },
      mostrarError(){
          alert('NO tens permis');
      }
    }
});



jQuery(function() {
    jQuery('.waveWrapper').css('height', '2000px');
});
