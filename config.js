/*******************Configuracio Base de Dades MySQL*************************/
exports.database = function(req, res){
    switch (req) {
      case 'host':
        return 'localhost';
        break;
      case 'user':
        return 'root';
        break;
      case 'password':
        return 'Informatica:1';
        break;
      case 'database':
        return 'monitornodeserver';
        break;
      default:
        return 'null';
    }
    //sudo mysql -u root -p monitornodeserver
    //return Date();
}
