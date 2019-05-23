new Vue({
  el: '#app',
  data: {
      dadesUsuariBD: [],
      dadesSOFTWARE: [],
      dadesRSS:[]
  },
  created: function(){
      this.obtenirDadesUsuariBD();
      this.obtenirDadesSOFTWARE();
      this.obtenirRSS();
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
      obtenirRSS(){
          this.$http.get('/demanarRSS').then(function(response){
              this.dadesRSS = response.data;
          });
      }

    }
});


jQuery(function() {
    setTimeout(mostrarFondo,3000);
    function mostrarFondo(){
        jQuery('.waveWrapper').css('height', jQuery('.rss_content').css('height'));
    }
});
