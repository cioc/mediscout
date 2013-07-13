var hospitalTemplateStr = "<% _.each(rows, function(row){%><div class='cellTemplate'><div class='cellTextContainer'><div class='cellHeader'><%= row.name %></div><div class='neighborhood'><%= row.options %></div><div class='avgPrice'>$<%= row.billed %></div></div></div><% }); %>";

var procedureTemplateStr = "<% _.each(rows, function(row){%><div class='cellTemplate'><div class='cellTextContainer'><div class='cellHeader'><%= row.hospitalName %></div><div class='neighborhood'><%= row.neighborhood %></div><div class='avgPrice'>$<%= row.billed %></div></div></div><% }); %>";

var hospitalTemplate = _.template(hospitalTemplateStr);

var procedureTemplate = _.template(procedureTemplateStr);

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
    $.get('/api/hospital/'+id+'/procedures', function(data){
      console.log(data);
      _.each(data, function(i){
        i.name = i.name.toLowerCase();
        i.name = i.name.charAt(0).toUpperCase() + i.name.slice(1);
        i.billed = Math.round(i.billed * 100) / 100;
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
    $.get('/api/procedure/'+id+'/hospitals', function(data){
      console.log(data);    
      _.each(data, function(i){
        i.billed = Math.round(i.billed * 100) / 100;
      });
      $('.inputContainer2').after(procedureTemplate({rows: data}));
    }); 
  }
});
