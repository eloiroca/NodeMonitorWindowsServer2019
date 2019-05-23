/*****************************************************************************/
/*                        Creem el servidor Web                              */
/*****************************************************************************/
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

/*****************************************************************************/
/*                   Importem els frameworks que necessitem                  */
/*****************************************************************************/
const colors = require('colors');
const mysql = require('mysql');
const cmd = require('node-cmd');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs');
const os = require('os');
const parse = require('feed-reader').parse;

/*****************************************************************************/
/*                           Importem fitxer de config                       */
/*****************************************************************************/
const config = require('./config.js');

/*****************************************************************************/
/*                     Dedclarem les variables globals                       */
/*****************************************************************************/
var numeroUsuari=0;
var conexions = new Array();
var posicio_array;
let urlRSS = 'http://planet.ubuntu.com/rss20.xml';
var nom = "";

/*****************************************************************************/
/*                     Connexió a la Base de Dades                           */
/*****************************************************************************/
var connection = mysql.createConnection({
	host     : config.database('host'),
	user     : config.database('user'),
	password : config.database('password'),
	database : config.database('database')
});
connection.query('SELECT * FROM usuaris ', function(error, results, fields) {
	if (error != null){
		console.log('ERROR EN LA BASE DE DADES '+ error);
	}
});

/*****************************************************************************/
/*                     Configurem el servidor http                           */
/*****************************************************************************/
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.get('/', (request, response) => {
    response.redirect('./index.html');
    response.end();
});

//Servim tots els fixers del directori /public de forma estatica a la ruta virtual /
app.use('/', express.static('public'));

/*****************************************************************************/
/*                              ROUTES POST                                  */
/*****************************************************************************/
app.post('/login', function(request, response) {
	var nomusuari = request.body.nomusuari;
	var contrasenya = request.body.contrasenya;
	if (nomusuari && contrasenya) {
		var data = {"usuari": nomusuari, "contrasenya": contrasenya};
		//Mirem si l'usuari esta dins del LDAP sino no podra entrar
		cmd.get(`ldapsearch -xLLL -b "dc=identityeye,dc=com" uid=`+nomusuari+` uidNumber uid displayName initials homeDirectory mail postalCode`,
		        function(err, data, stderr){
				if (!err) {
				var str = String(data);
				if (str.length != 0){
					var split_str = str.split("\n");
					var split_grup = split_str[0].split(",");
					var grup = split_grup[1].substr(3);
					var dadesUsuari = {"uidNumber": split_str[3].substr(11), "uid": split_str[1].substr(5), "grup": grup, "displayName": split_str[2].substr(13), "initials": split_str[7].substr(10), "homeDirectory": split_str[4].substr(15), "mail": split_str[5].substr(6), "postalCode": split_str[6].substr(12)}
					dadesUsuari = JSON.stringify(dadesUsuari);

					request.session.loggedin = true;
					request.session.username = nomusuari;
					request.session.grupname = grup;
					request.session.userdata = dadesUsuari;
					connection.query('SELECT * FROM usuaris WHERE uid = ?', [nomusuari], function(error, results, fields) {
						if (results.length > 0) {
							connection.query('SELECT contrasenya FROM usuaris WHERE uid = ?', [nomusuari], function(error, results, fields) {
								if (results.length > 0) {
									bcrypt.compare(contrasenya, results[0].contrasenya, function(err, res) {
										  if(res) {
											request.session.loggedinDashboard = true;
											inserirComentariLog("L'Usuari "+nomusuari+" ha iniciat sessio");
											response.redirect('/dashboard');
										  } else {
											response.send('<meta http-equiv="refresh" content="0; url=/">');
										  }
									});
								}else {
									console.log('error');
								}
							});
						}else{
							response.redirect('/registre_contrasenya');
						}
					});
				}else {
					response.send('<meta http-equiv="refresh" content="0; url=/">');
				}
			}else {
				response.send('<meta http-equiv="refresh" content="0; url=/">');
		        }
		});
	} else {
		response.send('<meta http-equiv="refresh" content="0; url=/">');
		response.end();
	}
});

//Processar el formulari de Editar Foto
app.post('/editar_imatge', function(req, res) {
	var form = new formidable.IncomingForm();
    	form.parse(req, function (err, fields, files) {
		console.log(fields);
		var oldpath = files.file.path;
    		var newpath = '/var/www/html/NodeMonitorWindowsServer2019/public/uploads/' + files.file.name;
    		fs.rename(oldpath, newpath, function (err) {
    			if (err) throw err;
			connection.query('update usuaris set imatge = ? where uid = "eroca"', [newpath]);
			//inserirComentariLog("L'Usuari "+dadesFormulari.uid+" ha creat el seu perfil");
      		});

      		res.write('File uploaded');
      		res.end();
    	});
});

//Processar el formulari de usuari
app.post('/editar_usuari', function(req, res) {
	var dadesFormulari = JSON.parse(req.body.dades);
	//Si no existeix l'usuari el creem i sino l'actualitzem
	connection.query('SELECT * FROM usuaris WHERE uid = ?', [dadesFormulari.uid], function(error, results, fields) {
		if (results.length > 0) {
			//Encriptem la contrasenya
			bcrypt.hash(dadesFormulari.contrasenya, 10, function(err, hash) {
				connection.query('update usuaris set displayName = ?, contrasenya = ?, mail = ? where uidNumber = ?', [dadesFormulari.displayName,hash,dadesFormulari.mail,dadesFormulari.uidNumber]);
				inserirComentariLog("L'Usuari "+dadesFormulari.uid+" ha modificat el seu perfil");
			});
		} else {
			//Encriptem la contrasenya
			bcrypt.hash(dadesFormulari.contrasenya, 10, function(err, hash) {
				connection.query('insert into usuaris (uidNumber, uid, displayName, contrasenya, grup, mail, initials, homeDirectory) values (?,?,?,?,?,?,?,?)', [dadesFormulari.uidNumber,dadesFormulari.uid,dadesFormulari.displayName,hash,dadesFormulari.grup,dadesFormulari.mail,dadesFormulari.initials,dadesFormulari.homeDirectory]);
				inserirComentariLog("L'Usuari "+dadesFormulari.uid+" ha creat el seu perfil");
			});
		}
	});

	req.session.loggedinDashboard = true;
	res.status(200).json({"estat": "correcte"});
});

//Servir les COMANDES
app.post('/servirCOMANDA', function(req, res) {
	var dadesCOMANDA = req.body.dades;
	connection.query('UPDATE comandesvenda set estat = "servida" where id_comanda = ?', [dadesCOMANDA.numComanda], function(error, results, fields) {
		if (error === null) {
			inserirComentariLog("L'Usuari "+dadesCOMANDA.nomUsuari+" ha servit la comanda "+dadesCOMANDA.numComanda);
			res.status(200).json({"estat": "correcte"});
		}else{
			res.status(200).json({missatge: 'error al recuperar les COMANDES de la BD'});
		}
	});
});

//Mostrar els productes de la Comanda
app.post('/mostrarCOMANDA', function(req, res) {
	var dadesCOMANDA = req.body.dades;
	connection.query('select * from comandesproductes where id_comanda = ?', [dadesCOMANDA.numComanda], function(error, results, fields) {
			if (error === null) {
					res.status(200).json(results);
			}else{
				res.status(200).json({missatge: 'error al recuperar les COMANDES de la BD'});
			}
	});
});

//Eliminar les COMANDES
app.post('/eliminarCOMANDA', function(req, res) {
	var dadesCOMANDA = req.body.dades;
	connection.query('delete from comandesvenda where id_comanda = ?', [dadesCOMANDA.numComanda], function(error, results, fields) {
		if (error === null) {
			inserirComentariLog("L'Usuari "+dadesCOMANDA.nomUsuari+" ha eliminat la comanda "+dadesCOMANDA.numComanda);
			res.status(200).json({"estat": "correcte"});
		}else{
			res.status(200).json({missatge: 'error al recuperar les COMANDES de la BD'});
		}
	});
});

/*****************************************************************************/
/*                              ROUTES GET                                   */
/*****************************************************************************/
//Servir la sessio d'usuari quan les demana el client
app.get('/demanarSessio', function(req, res) {
	res.status(200).json(req.session.userdata);
});

//Servir les dades d'usuari quan les demana el client
app.get('/demanarDadesBD', function(req, res) {
	connection.query('SELECT * FROM usuaris WHERE uid = ?', [req.session.username], function(error, results, fields) {
	if (results.length > 0) {
		if (results[0].imatge === null){ var imatge = 'icono-usuari-defecte.png'; } else { var imatge = results[0].imatge; }
			var dadesUsuariBD = {"uidNumber": results[0].uidNumber, "uid": results[0].uid, "grup": results[0].grup, "displayName": results[0].displayName, "initials": results[0].initials, "homeDirectory": results[0].homeDirectory, "mail": results[0].mail, "imatge": imatge, "contrasenya": results[0].contrasenya}
			dadesUsuariBD = JSON.stringify(dadesUsuariBD);
			res.status(200).json(dadesUsuariBD);
		}else{
			res.status(200).json({missatge: 'error al recuperar les dades de usuari a la BD'});
		}
	});
});

//Servir el feed RSS
app.get('/demanarRSS', function(req, res) {
	parse(urlRSS).then((feed) => {
		res.status(200).json(feed);
	}).catch((err) => {
		console.log(err);
	});
});

//Servir les COMANDES
app.get('/demanarCOMANDES', function(req, res) {
	connection.query('SELECT e.id_comanda, e.nom, e.cognoms, e.nif, e.genere, e.poblacio, e.foto_perfil, e.estat, ROUND(SUM(a.preu), 2) preu, e.id_usuari FROM comandesvenda e inner join comandesproductes a on e.id_comanda = a.id_comanda where e.estat = "pendent" group by e.nom, e.id_comanda, e.cognoms, e.nif, e.genere, e.poblacio, e.foto_perfil, e.id_usuari', function(error, results, fields) {
		if (results.length > 0) {
			var dadesComandesVenda = results;
			dadesComandesVenda = JSON.stringify(dadesComandesVenda);
			res.status(200).json(dadesComandesVenda);
		}else{
			res.status(200).json({missatge: 'error al recuperar les COMANDES de la BD'});
		}
	});
});

//Servir les comandes servides
app.get('/demanarComandesServides', function(req, res) {
	connection.query('SELECT e.id_comanda, e.nom, e.cognoms, e.nif, e.genere, e.poblacio, e.foto_perfil, e.estat, ROUND(SUM(a.preu), 2) preu, e.id_usuari FROM comandesvenda e inner join comandesproductes a on e.id_comanda = a.id_comanda where e.estat = "servida" group by e.nom, e.id_comanda, e.cognoms, e.nif, e.genere, e.poblacio, e.foto_perfil, e.id_usuari', function(error, results, fields) {
		if (results.length > 0) {
			var dadesComandesVenda = results;
			dadesComandesVenda = JSON.stringify(dadesComandesVenda);
			res.status(200).json(dadesComandesVenda);
		}else{
			res.status(200).json({missatge: 'error al recuperar les COMANDES de la BD'});
		}
	});
});

//Servir dades CPU
app.get('/demanarDadesCPU', function(req, res) {
	cmd.get(`ps aux | awk ' {cpu+=$3} END {printf("%d%%",cpu) }'`,
		function(err, data, stderr){
			if (!err) {
				var str = String(data);
				var split_cpu = str.split("%");
				var usCPU = parseInt(split_cpu[0]);
				if  (usCPU >= 100){
					usCPU = 99;
				}
				cmd.get(`cat /proc/cpuinfo | grep 'model name'`,
				function(err, data, stderr){
					if (!err) {
						var str = String(data);
						var split_str = str.split("\n");
						var num_cpu_cores = split_str.length-1;
						split_str = split_str[0].split(":");
						var split_cpu_nom = split_str[1];
						var dadesCPU = {"nomCPU": split_cpu_nom, "percentatgeUs": usCPU, "cores": num_cpu_cores}
						dadesCPU = JSON.stringify(dadesCPU);
						res.status(200).json(dadesCPU);
					}else {
						console.log(err);
					}
				});
			}else {
				console.log(err);
			}
		});
});

//Servir dades RAM
app.get('/demanarDadesRAM', function(req, res) {
	cmd.get(`free -h`,
	function(err, data, stderr){
		if (!err) {
			var str = String(data);
			var split_str = str.split("\n");
			var split_memoria = split_str[1].split(" ");
			var arrayMemoria =  split_memoria.filter(Boolean);
			var memoriaTotal = arrayMemoria[1].slice(0, -1).replace(",", ".");
			var memoriaLliure = arrayMemoria[6].slice(0, -1).replace(",", ".");

			//Ho passem tot en MB cap al client
			if(memoriaTotal<32){
				memoriaTotal=memoriaTotal*1024;
			}
			if (memoriaLliure<32) {
				memoriaLliure=memoriaLliure*1024;
			}

			var dadesRAM = {"totalRAM":memoriaTotal, "lliureRAM": memoriaLliure}
				dadesRAM = JSON.stringify(dadesRAM);
				res.status(200).json(dadesRAM);
			}else {
				console.log(err);
			}
	});
});

//Servir dades DISCO
app.get('/demanarDadesDISCO', function(req, res) {
	cmd.get(`df -h --output=source,size,used | grep sda`,
		function(err, data, stderr){
			if (!err) {
				var str = String(data);
				var split_str = str.split("\n");
				var split_memoria = split_str[0].split(" ");
				var arrayMemoriaDisco =  split_memoria.filter(Boolean);
				var memoriaTotalDISCO = parseInt(arrayMemoriaDisco[1].slice(0, -1).replace(",", "."));
				var memoriautilitzadaDISCO = parseInt(arrayMemoriaDisco[2].slice(0, -1).replace(",", "."));
				var dadesDISCO = {"totalDISCO":memoriaTotalDISCO, "utilitzadaDISCO": memoriautilitzadaDISCO}
				dadesDISCO = JSON.stringify(dadesDISCO);
				res.status(200).json(dadesDISCO);
			}else {
				console.log(err);
			}
		});
});

//Servir dades SOFTWARE
app.get('/demanarDadesSOFTWARE', function(req, res) {
	 //RED
	 var objecteRED = os.networkInterfaces();
	 var numAdaptadors = Object.keys(objecteRED);
	 var adaptadorsConfig = [];
	 var cont = 0;
	 for (var objecte in objecteRED){
		var adaptador = {'nom': numAdaptadors[cont], 'address': objecteRED[objecte][0].address, 'mascara': objecteRED[objecte][0].netmask, 'familia': objecteRED[objecte][0].family, 'mac': objecteRED[objecte][0].mac}
		cont ++;
		adaptadorsConfig.push(adaptador)
	 }
	 //SO
	 var arquitecturaSO = os.arch();
	 var hostnameSO = os.hostname();
	 var plataformaSO = os.platform();
	 var tipusSO = os.type();
	 cmd.get(`lsb_release -a`,
 		function(err, data, stderr){
 			if (!err) {
				var str = String(data);
				var split_str = str.split("\n");
				var nomSO = split_str[1].split('Description:\t');
				var dadesSOFTWARE = {"arquitecturaSO":arquitecturaSO, "hostnameSO": hostnameSO, "plataformaSO": plataformaSO, "nomSO": nomSO[1], "dadesRED": adaptadorsConfig}
			 	dadesSOFTWARE = JSON.stringify(dadesSOFTWARE);
			 	res.status(200).json(dadesSOFTWARE);
			}else {
				console.log(err);
			}
	});
});

//Servir dades SERVEIS
app.get('/demanarDadesServeis', function(req, res) {
	cmd.get(`sudo /etc/init.d/isc-dhcp-server status | grep Active && /etc/init.d/bind9 status | grep Active && /etc/init.d/slapd status | grep Active && /etc/init.d/mysql status | grep Active && /etc/init.d/vsftpd status | grep Active && /etc/init.d/cups status | grep Active`,
		function(err, data, stderr){
			if (!err) {
				var str = String(data);
				var split_str = str.split("\n");
				var array_serveis = [];
				for (var i = 0; i < split_str.length; i++) {
					var estat_array = split_str[i].split(" ");
					var estat_obert = estat_array.includes("(running)");
					array_serveis.push(estat_obert);
				}
				var dadesSERVEIS = {"ServeiDHCP":{"nom":"ServeiDHCP", "estat": array_serveis[0]}, "ServeiDNS": {"nom":"ServeiDNS", "estat": array_serveis[1]}, "ServeiLDAP": {"nom":"ServeiLDAP", "estat": array_serveis[2]}, "ServeiMYSQL": {"nom":"ServeiMYSQL", "estat": array_serveis[3]}, "ServeiFTP": {"nom":"ServeiFTP", "estat": array_serveis[4]}, "ServeiCUPS": {"nom":"ServeiCUPS", "estat": array_serveis[5]}}
				dadesSERVEIS = JSON.stringify(dadesSERVEIS);
				 res.status(200).json(dadesSERVEIS);
			 }else {
			 	console.log(err);
			 }
		});
});

//Servir dades SERVEIS
app.get('/demanarDadesUsuarisBd', function(req, res) {
	connection.query('SELECT * FROM usuaris', function(error, results, fields) {
		if (results.length > 0) {
			var dadesUSUARISBD = results
			dadesUSUARISBD = JSON.stringify(dadesUSUARISBD);
			res.status(200).json(dadesUSUARISBD);
		}else{
			console.log(results);
		}
	});
});

//Servir contingut del arxiu LOG
app.get('/demanarRegistresLog', function(req, res) {
	fs.readFile("SystemFiles/logs.txt", 'utf8', (error, datos) => {
		if (error) throw error;
		var dadesLOG = datos
		dadesLOG = JSON.stringify(dadesLOG);
		res.status(200).json(dadesLOG);
	});
});

//Servir Pantalla Crear Usuari
app.get('/registre_contrasenya', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('./views/crear_usuari.html');
	}else {
		response.send('Inicia Sessió per entrar aquí dins!');
	}
});

//Servir Pantalla Editar Usuari
app.get('/editar_usuari', function(request, response) {
	if (request.session.loggedin) {
		response.redirect('./views/editar_usuari.html');
	}else {
		response.send('Inicia Sessió per entrar aquí dins!');
	}
});

//Servir Pantalla Dashboard
app.get('/dashboard', function(request, response) {
		if (request.session.loggedinDashboard) {
			response.redirect('./views/dashboard.html');
		}else {
			response.send('Inicia Sessió per entrar aquí dins!');
		}
});

//Servir Pantalla Comandes de Venda
app.get('/comandesvenda', function(request, response) {
		if (request.session.loggedinDashboard) {
			response.redirect('./views/comandesvenda.html');
		}else {
			response.send('Inicia Sessió per entrar aquí dins!');
		}
});

//Servir Pantalla Logs
app.get('/logs', function(request, response) {
		if (request.session.loggedinDashboard) {
			response.redirect('./views/logs.html');
		}else {
			response.send('Inicia Sessió per entrar aquí dins!');
		}
});

//Servir Pantalla Informacio
app.get('/informacio', function(request, response) {
		if (request.session.loggedinDashboard) {
			response.redirect('./views/informacio.html');
		}else {
			response.send('Inicia Sessió per entrar aquí dins!');
		}
});

//Servir Pantalla RSS
app.get('/rss', function(request, response) {
	if (request.session.loggedinDashboard) {
		response.redirect('./views/rss.html');
	}else {
		response.send('Inicia Sessió per entrar aquí dins!');
	}
});

//Desconectar Usuari
app.get('/logout', function(request, response) {
	request.session.loggedin = false;
	request.session.loggedinDashboard = false;
	inserirComentariLog("L'Usuari "+request.session.username+" ha tancat sessio");
	response.redirect('./');
});

/*****************************************************************************/
/*                                   Funcions                                */
/*****************************************************************************/

function inserirComentariLog(comentari){
	var d = new Date();
	var data = d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()+"-"+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
	fs.appendFile('SystemFiles/logs.txt', data+" -------> "+comentari+"\n", (err) => {
  if (err) throw err;
	});

	//console.log(comentari);
}

/*****************************************************************************/
/*                         Obrim el servidor http                            */
/*****************************************************************************/
app.listen(5443, () =>{
    console.log('Servidor escoltant pel port 5443..'.green);
});
