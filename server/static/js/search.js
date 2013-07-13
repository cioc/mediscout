var resultTemplateStr = "<% _.each(rows, function(row){%><div class='searchDropDown'><div class='searchText'><a href='/<%= row.result_type %>/<%= row.id %>'><%= row.name %></a></div><div class='searchTextDescription'><a><%= row.extra %></a></div></div><% }); %>";

var resultTemplate = _.template(resultTemplateStr);

function search() {
  var v = $('#search').val();
  v = v.replace(' ', '-');
  if (v.length > 0) {
    $.get('/api/search/'+v, function(data){
      console.log(data);
      $('.searchDropDown').remove();
      $('.inputContainer').append(resultTemplate({rows: data}));
    }, 'json');
  }
  else {
    $('.searchDropDown').remove();
  }
}

var myTimeout = null;

$(document).ready(function(){
  $('#search').keydown(function(){
    if (myTimeout != null) {
      clearTimeout(myTimeout);
    }
    myTimeout = setTimeout(search, 100);
  }); 
});
