function translateOption(op) {
  var pieces = op.split(' ');
  var out = '';
  _.each(pieces, function(p){
    if (p == 'W'){
      out += "With ";
    }
    if (p == 'W/O') {
      out += "Without ";
    }
    if (p == 'CC') {
      out += "Complications / Comorbidities "; 
    }
    if (p == 'MCC') {
      out += "Major Complications / Comorbidites ";
    }
    if (p == 'CC/MCC') {
       out += "(Major) Complications / Comorbidites ";
    }
  }); 
  if (out.length == 0) {
    return op;
  }
  return out;
}

$(document).ready(function(req, res){
  var path = window.location.pathname;
  var pieces = path.split('/');
  var type = pieces[1];
  var id = pieces[2];
  console.log(type);
  console.log(id); 
  if (type == 'hospital') {
    $.get('/api/hospital/'+id, function(data){
      console.log(data);
      console.log(data.name);
      $('#searchResultLabel').html(data.name.toString());
    }, 'json');
    var hospitalTemplateStr = "<% _.each(rows, function(row){%><div class='cellTemplate'><div class='cellTextContainer'><div class='cellHeader'><a href='/info/<%= row.fed_proc_id %>/"+id+"'><%= row.name %></a></div><div class='neighborhood'><%= row.options %></div><div class='avgPrice'>$<%= row.billed %></div></div></div><% }); %>";
    var hospitalTemplate = _.template(hospitalTemplateStr);
    $.get('/api/hospital/'+id+'/procedures', function(data){
      console.log(data);
      _.each(data, function(i){
        i.name = i.name.toLowerCase();
        i.name = i.name.charAt(0).toUpperCase() + i.name.slice(1);
        i.name = i.name.replace(',', ', ');
        i.name = i.name.replace('/', '/ ');
        i.billed = Math.round(i.billed * 100) / 100;
        i.options = translateOption(i.options);
      });
      $('.inputContainer2').after(hospitalTemplate({rows: data}));
    }, 'json'); 
  }
  if (type == 'procedure') {
    $.get('/api/procedure/'+id, function(data){
      console.log(data);
      var name = data.name; 
      name = name.toLowerCase();
      name = name.charAt(0).toUpperCase() + name.slice(1);
      $('#searchResultLabel').html(name);
    }, 'json'); 
    var procedureTemplateStr = "<% _.each(rows, function(row){%><div class='cellTemplate'><div class='cellTextContainer'><div class='cellHeader'><a href='/info/<%= row.fed_proc_id %>/<%= row.fed_id %>'><%= row.hospitalName %></a></div><div class='neighborhood'><%= row.neighborhood %></div><div class='avgPrice'>$<%= row.billed %></div></div></div><% }); %>";
    var procedureTemplate = _.template(procedureTemplateStr);
    $.get('/api/procedure/'+id+'/hospitals', function(data){
      console.log(data);    
      _.each(data, function(i){
        i.billed = Math.round(i.billed * 100) / 100;
      });
      $('.inputContainer2').after(procedureTemplate({rows: data}));
    }); 
  }
});
