$(document).ready(function(){
  var path = window.location.pathname;
  var pieces = path.split('/');
  var procedure = pieces[2];
  var hospital = pieces[3];
  console.log(procedure);
  console.log(hospital);
  $.get('/api/hospital/'+hospital, function(data){
    console.log(data);
    $('#hospitalName').html(data.name);
    $('#address').html(data.addr + ' ' + data.city + ', ' + data.state + ' ' + data.zip); 
  }, 'json');
  $.get('/api/hospital/'+hospital+'/procedures', function(data){
    var cost = "";
    _.each(data, function(r){
      if (r.fed_proc_id == procedure) {
        cost = r.billed;
      }
    });
    $('#cost').html('$'+Math.round(cost));  
  });
  $.get('/api/procedure/'+procedure, function(data){
    var name = data.name;
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    name = name.replace(',', ', ');
    name = name.replace('/', '/ ');
    $('#searchResultLabel').html(name);
  }, 'json');
  $.get('/api/procedure/'+procedure+'/avg', function(data){
    $('#avgcost').html('$'+Math.round(data.avg));
  }); 
});
