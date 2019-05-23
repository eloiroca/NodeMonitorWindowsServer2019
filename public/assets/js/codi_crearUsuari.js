const app = new Vue({
		el: '#app',
		data: {
				dadesUsuari: [],
				arxiu: '',
				contrasenya1: '',
				contrasenya2: '',
				estatBoto: false,
				errors: []
		},
		created: function(){
				this.obtenirDades();
		},
		methods:{
				obtenirDades(){
						this.$http.get('/demanarSessio').then(function(response){
								this.dadesUsuari = JSON.parse(response.data);
						});
				},
				comprobarValidacio(element, classe){
						//Expresio Regular
						var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
						correuValid = re.test(String(this.dadesUsuari.mail).toLowerCase());

						if (element==='nom' && classe==='has'){
							if (this.dadesUsuari.displayName === ''){return 'has-warning';}else{return 'has-success';}
						}else if (element==='nom' && classe==='icon') {
							if (this.dadesUsuari.displayName === ''){return 'glyphicon-warning-sign';}else{return 'glyphicon-ok';}
						}else if (element==='correu' && classe==='has') {
							if (this.dadesUsuari.mail === '' || correuValid === false){return 'has-warning';}else{return 'has-success';}
						}else if (element==='correu' && classe==='icon') {
							if (this.dadesUsuari.mail === '' || correuValid === false){return 'glyphicon-warning-sign';}else{return 'glyphicon-ok';}
						}else if (element==='contrasenyes' && classe==='has') {
							if (this.contrasenya1 === this.contrasenya2 && this.contrasenya1 != '' && this.contrasenya2 != ''){
								this.estatBoto = true;
								return 'has-success';
							}else{
								this.estatBoto = false;
								return 'has-error';
							}
						}else if (element==='contrasenyes' && classe==='icon') {
							if (this.contrasenya1 === this.contrasenya2 && this.contrasenya1 != '' && this.contrasenya2 != ''){return 'glyphicon-ok';}else{return 'glyphicon-remove';}
						}
				},
				comprobarFormulari(){
					if (this.contrasenya1 === this.contrasenya2 && (this.dadesUsuari.uidNumber != '' && this.dadesUsuari.uid != '' && this.dadesUsuari.grup != '' && this.dadesUsuari.displayName != '' && this.dadesUsuari.mail != '' && this.contrasenya1 != '' && this.contrasenya2 != '')){
							this.errors = [];
					}else if (this.dadesUsuari.uidNumber === '' || this.dadesUsuari.uid === '' || this.dadesUsuari.grup === '' || this.dadesUsuari.displayName === '' || this.dadesUsuari.mail === '' || this.contrasenya1 === '' || this.contrasenya2 === ''){
							this.errors = [];
							this.errors.push('Un dels camps esta buit!');
					}else if(this.contrasenya1 != this.contrasenya2){
							this.errors = [];
							this.errors.push('Les contrasenyes no són iguales!');
					}
					return this.errors;
				},
				overDirectori(){
						$('#directori').css( 'cursor', 'not-allowed' );
				},
				enviarFormulari(){
						var estat = this.comprobarFormulari();

						let formData = new FormData();
            formData.append("file", this.arxiu);

						if (estat.length === 0){
							var dadesFormulari = {"uidNumber": this.dadesUsuari.uidNumber, "uid": this.dadesUsuari.uid, "grup": this.dadesUsuari.grup, "displayName": this.dadesUsuari.displayName, "initials": this.dadesUsuari.initials, "homeDirectory": this.dadesUsuari.homeDirectory, "mail": this.dadesUsuari.mail, "contrasenya": this.contrasenya1}
							dadesFormulari = JSON.stringify(dadesFormulari);

							axios.post('/editar_usuari', {dades: dadesFormulari}).then((response) => {
									if (response.statusText === 'OK'){
										 $(location).attr('href', '/dashboard');
									}
	            }, (response) => {
		              console.log(response);
	            });
						}
	      }
		},
		computed:{
				estilError(){
						return{
							'estilFormulariInvalid' : contrasenya === false
						}
				},
				estilAdvertencia(){
						return {
								'has-warning' : this.dadesUsuari.mail == '',
								'has-success' : this.dadesUsuari.mail != ''
						}
				}
		}
})
jQuery(function() {
    jQuery('.waveWrapper').css('height', '100%');

});
