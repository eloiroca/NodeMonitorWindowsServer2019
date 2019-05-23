new Vue({
  el: '#app',
  data: {
      dadesUsuariBD: [],
      dadesCPU: [],
      dadesRAM: [],
      dadesDISCO: [],
      dadesSOFTWARE: [],
      dadesSERVEIS: [],
      dadesUSUARISBD: []
  },
  created: function(){
      this.obtenirDadesUsuariBD();
      this.obtenirDadesCPU();
      this.obtenirDadesRAM();
      this.obtenirDadesDISCO();
      this.obtenirDadesSOFTWARE();
      this.obtenirDadesSERVEIS();
      this.obtenirDadesUSUARISBD();
  },
  methods:{
    obtenirDadesUsuariBD(){
        this.$http.get('/demanarDadesBD').then(function(response){
          try {
                this.dadesUsuariBD = JSON.parse(response.data);
                console.log(this.dadesUsuariBD.grup);
          } catch(e) {
              Swal.fire({
                title: "ALERTA",
                text: "No has iniciat sessio per accedir!!!",
                confirmButtonText: "Acceptar",
              });
          }
        });
    },
      obtenirDadesCPU(){
        const self = this;
        this.intervalid1 = setInterval(function(){
          self.$http.get('/demanarDadesCPU').then(function(response){
              self.dadesCPU = JSON.parse(response.data);
              self.pintarGraficCPU();
          });
        }, 1000);
      },
      obtenirDadesRAM(){
        const self = this;
        this.intervalid1 = setInterval(function(){
          self.$http.get('/demanarDadesRAM').then(function(response){
              self.dadesRAM = JSON.parse(response.data);
              self.pintarGraficRAM();
          });
        }, 1000);
      },
      obtenirDadesDISCO(){
        this.$http.get('/demanarDadesDISCO').then(function(response){
            this.dadesDISCO = JSON.parse(response.data);
            this.pintarGraficDISCO();
        });
      },
      obtenirDadesSOFTWARE(){
        this.$http.get('/demanarDadesSOFTWARE').then(function(response){
            this.dadesSOFTWARE = JSON.parse(response.data);
        });
      },
      obtenirDadesSERVEIS(){
        this.$http.get('/demanarDadesServeis').then(function(response){
            this.dadesSERVEIS = JSON.parse(response.data);
        });
      },
      obtenirDadesUSUARISBD(){
        this.$http.get('/demanarDadesUsuarisBd').then(function(response){
            this.dadesUSUARISBD = JSON.parse(response.data);
        });
      },
      pintarGraficCPU(){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        var nomCPU = this.dadesCPU.nomCPU;
        var num_cpu_cores = this.dadesCPU.cores;
        var percentatgeUs = this.dadesCPU.percentatgeUs;
        var lliure = 100-percentatgeUs;
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
                  ['Language', 'Rating'],
                  ['Utilitzat', Number(percentatgeUs)],
                  ['Lliure', Number(100-percentatgeUs)]
          ]);
          var options = {
            title: 'PROCESSADOR'+nomCPU+' , '+num_cpu_cores+' cores',
            colors: ['#2ECC71', '#AEB6BF'],
            pieHole: 0.2
          };
          var chart = new google.visualization.PieChart(document.getElementById('estatCPU'));
          chart.draw(data, options);
        }
      },
      pintarGraficRAM(){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        var totalRAM = this.dadesRAM.totalRAM;
        var lliureRAM = this.dadesRAM.lliureRAM;
        var utilitzadaRAM = totalRAM-lliureRAM;
        var percentatgeLliureRAM = (lliureRAM * 100)/totalRAM;
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
                  ['Language', 'Rating'],
                  ['Usant '+Math.round(utilitzadaRAM)+' MB' , 100-percentatgeLliureRAM],
                  ['Lliure '+Math.round(lliureRAM)+' MB', percentatgeLliureRAM]
          ]);
          var options = {
            title: 'MEMORIA RAM '+ 'TOTAL: '+Math.round(totalRAM)+' MB',
            colors: ['#2ECC71', '#AEB6BF'],
            pieHole: 0.2
          };
          var chart = new google.visualization.PieChart(document.getElementById('estatRAM'));
          chart.draw(data, options);
        }
      },
      pintarGraficDISCO(){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(drawChart);
        var totalDISCO = this.dadesDISCO.totalDISCO;
        var utilitzadaDISCO = this.dadesDISCO.utilitzadaDISCO;
        var lliureDISCO = totalDISCO-utilitzadaDISCO;
        var percentatgeUtilitzadaDISCO = (utilitzadaDISCO * 100)/totalDISCO;
        function drawChart() {
          var data = google.visualization.arrayToDataTable([
                  ['Language', 'Rating'],
                  ['Utilitzat '+utilitzadaDISCO+' GB' , percentatgeUtilitzadaDISCO],
                  ['Lliure '+lliureDISCO+' GB', 100-percentatgeUtilitzadaDISCO]
          ]);
          var options = {
            title: 'DISC DUR '+ 'TOTAL: '+totalDISCO+' GB',
            colors: ['#2ECC71', '#AEB6BF'],
            pieHole: 0.2
          };
          var chart = new google.visualization.PieChart(document.getElementById('estatDISCO'));
          chart.draw(data, options);
        }
      }
    }
});

jQuery(function() {
    jQuery('.waveWrapper').css('height', '210%');
});
